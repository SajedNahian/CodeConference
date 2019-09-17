const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

const auth = require('../../middleware/auth');
const User = require('../../models/User');
const CodeFile = require('../../models/File');
const Folder = require('../../models/Folder');

router.get('/myFolders', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id })
      .populate('sharedFolders', ['nickname'])
      .populate('ownedFolders', ['nickname']);

    return res.json({
      ownedFolders: user.ownedFolders,
      sharedFolders: user.sharedFolders
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

router.post(
  '/createFolder',
  auth,
  [
    check('nickname', 'Nickname is required')
      .not()
      .isEmpty(),
    check('password', 'Password is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    const { nickname, password } = req.body;
    try {
      let folder = await Folder.findOne({ nickname });
      if (folder) {
        return res
          .status(400)
          .send({ errors: { msg: 'That nickname is already in use.' } });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      folder = new Folder({
        nickname,
        password: hashedPassword
      });

      await folder.save();
      const user = await User.findOne({ _id: req.user.id });
      console.log(user);
      user.ownedFolders = [folder.id, ...user.ownedFolders];
      await user.save();
      res.json(user.ownedFolders);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/joinFolder',
  auth,
  [
    check('nickname', 'Folder nickname is required')
      .not()
      .isEmpty(),
    check('password', 'Password is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { nickname, password } = req.body;
    try {
      const user = await User.findOne({ _id: req.user.id })
        .populate('sharedFolders', ['nickname'])
        .populate('ownedFolder', ['nickname']);

      const alreadyJoined =
        user.ownedFolders.some(folder => folder.nickname == nickname) ||
        user.sharedFolders.some(folder => folder.nickname == nickname);
      if (alreadyJoined) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'You already have access to this file' }] });
      }
      const folder = await Folder.findOne({ nickname });
      if (!folder) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'There is no folder with that nickname' }] });
      }
      const isMatch = await bcrypt.compare(password, folder.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Incorrect password' }] });
      }

      user.sharedFolders = [folder.id, ...user.sharedFolders];
      await user.save();
      return res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

router.get('/:folderId', auth, async (req, res) => {
  try {
    const { folderId } = req.params;
    const user = await User.findOne({ _id: req.user.id });
    const isOwner = user.ownedFolders.some(folder => folder == folderId);
    const wasShared = user.sharedFolders.some(folder => folderId == folder);

    if (!isOwner && !wasShared) {
      return res
        .status(401)
        .json({ errors: [{ msg: 'You do not have access to that file' }] });
    }

    const folder = await Folder.findOne({ _id: folderId }).populate('files', [
      'fileName'
    ]);

    res.json({
      isOwner: isOwner,
      files: folder.files
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

router.post(
  '/:folderId/createFile',
  auth,
  [
    check('language', 'Language is required')
      .not()
      .isEmpty(),
    check('fileName', 'fileName is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const folderId = req.params.folderId;
      const { language, fileName } = req.body;

      const user = await User.findOne({ _id: req.user.id });
      const ownsFolder = user.ownedFolders.some(folder => folder == folderId);

      if (!ownsFolder) {
        return res.status(401).json({
          errors: [{ msg: 'Sorry you do not have permission to do that' }]
        });
      }

      const folder = await Folder.findOne({ _id: folderId }).populate('files', [
        'fileName'
      ]);

      const fileWithNameAlreadyExists = folder.files.some(
        file => file.fileName == fileName
      );

      if (fileWithNameAlreadyExists) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'A file with that name already exists' }] });
      }

      const newFile = new CodeFile({
        language,
        fileName: fileName + (language == 'java' ? '.java' : '.py'),
        textContent:
          language == 'java'
            ? `public class ${fileName} {
  public static void main(String[] args) {
      System.out.println("Hello from ${fileName}.java");
  }
}`
            : `print('Hello from the ${fileName}.py file')`
      });

      await newFile.save();
      folder.files = [newFile.id, ...folder.files];
      await folder.save();
      res.json(folder);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/:folderId/:fileId', auth, async (req, res) => {
  try {
    const { folderId, fileId } = req.params;
    // Make sure we have access to that folder
    const user = await User.findOne({ _id: req.user.id });
    const isOwner = user.ownedFolders.some(folder => folder == folderId);
    const hasAccess =
      isOwner || user.sharedFolders.some(folder => folder == folder.id);

    if (!hasAccess) {
      return res.status(400).json({
        errors: [{ msg: 'Sorry you do not have access to that file' }]
      });
    }

    const folder = await Folder.findOne({ _id: folderId }).populate('files');

    const file = folder.files.find(file => file.id == fileId);
    if (!file) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Sorry that file does not exist' }] });
    }

    return res.json({ file });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/:folderId/:fileId/save', auth, async (req, res) => {
  try {
    const { folderId, fileId } = req.params;
    const user = await User.findOne({ _id: req.user.id });
    const isOwner = user.ownedFolders.some(folder => folder == folderId);

    if (!isOwner) {
      return res.status(401).json({
        errors: [{ msg: 'You do not have permission to save this file' }]
      });
    }

    const folder = await Folder.findOne({ _id: folderId });
    const hasFile = folder.files.some(file => file == fileId);

    if (!hasFile) {
      return res.status(400).json({
        errors: [{ msg: 'Sorry that file does not exist' }]
      });
    }

    const file = await CodeFile.findOne({ _id: fileId });
    file.textContent = req.body.textContent ? req.body.textContent : '';
    await file.save();
    res.json({ file });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
