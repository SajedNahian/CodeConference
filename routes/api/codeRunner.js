const express = require('express');
const router = express.Router();
const runCode = require('../../util/codeRunner');
const auth = require('../../middleware/auth');

router.post('/run', auth, (req, res) => {
  const { language, fileName, code } = req.body;
  runCode(language, fileName, code, output => {
    res.json(output);
  });
});

module.exports = router;
