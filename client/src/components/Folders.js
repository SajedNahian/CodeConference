import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getFolders, createFolder, joinFolder } from '../actions/folders';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';

const Folders = ({
  getFolders,
  folders: { folders, loading, errors },
  createFolder,
  joinFolder
}) => {
  useEffect(() => {
    getFolders();
  }, []);

  const [joinFolderFormData, changeFolderFormData] = useState({
    nickname: '',
    password: '',
    showPassword: false
  });

  const onJoinFolderFormDataChange = e => {
    if (e.target.name == 'showPassword') {
      return changeFolderFormData({
        ...joinFolderFormData,
        showPassword: !joinFolderFormData.showPassword
      });
    }

    changeFolderFormData({
      ...joinFolderFormData,
      [e.target.name]: e.target.value
    });
  };

  const [createFolderFormData, changeCreateFolderFormData] = useState({
    nickname: '',
    password: '',
    showPassword: false
  });

  const [currentHover, setCurrentHover] = useState('');

  const onSubmitNewFolder = () => {
    createFolder(createFolderFormData);
  };

  const onCreateFolderFormDataChange = e => {
    if (e.target.name == 'showPassword') {
      return changeCreateFolderFormData({
        ...createFolderFormData,
        showPassword: !createFolderFormData.showPassword
      });
    }

    changeCreateFolderFormData({
      ...createFolderFormData,
      [e.target.name]: e.target.value
    });
  };

  const onJoinFolderSubmit = () => {
    joinFolder(joinFolderFormData);
  };

  if (loading) {
    return <Spinner />;
  }
  const { ownedFolders, sharedFolders } = folders;
  return (
    <Fragment>
      <div class='container mt-4'>
        {errors.map(err => (
          <div class='alert alert-danger' role='alert'>
            {err.msg}
          </div>
        ))}
        <div class='row'>
          <button
            type='button'
            class='btn btn-dark mr-3'
            data-toggle='modal'
            data-target='#newFileModal'
          >
            <i class='fas fa-folder-plus' /> New Folder
          </button>
          <button
            type='button'
            class='btn btn-dark'
            data-toggle='modal'
            data-target='#joinFileModal'
          >
            <i class='fas fa-copy' /> Join Folder
          </button>
        </div>

        <h2 class='mt-4'>Your Folders</h2>
        <div class='row'>
          {ownedFolders &&
            ownedFolders.map(folder => (
              <Link
                class='col-3'
                to={`/folder/${folder._id}`}
                style={{ color: 'inherit', textDecoration: 'inherit' }}
                onMouseEnter={() => setCurrentHover(folder._id)}
                onMouseLeave={() => setCurrentHover('')}
              >
                <div class='card mr-3'>
                  <div class='card-body text-center'>
                    <h4>
                      <i
                        class={`fa ${
                          currentHover == folder._id
                            ? 'fa-folder-open'
                            : 'fa-folder'
                        }`}
                      />{' '}
                      {folder.nickname}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        <h2 class='mt-4'>Shared Folders</h2>
        <div class='row'>
          {sharedFolders &&
            sharedFolders.map(folder => (
              <Link
                class='col-3'
                to={`/folder/${folder._id}`}
                style={{ color: 'inherit', textDecoration: 'inherit' }}
                onMouseEnter={() => setCurrentHover(folder._id)}
                onMouseLeave={() => setCurrentHover('')}
              >
                <div class='card mr-3'>
                  <div class='card-body text-center'>
                    <h4>
                      <i
                        class={`fa ${
                          currentHover == folder._id
                            ? 'fa-folder-open'
                            : 'fa-folder'
                        }`}
                      />{' '}
                      {folder.nickname}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
      <div
        class='modal fade'
        id='newFileModal'
        tabindex='-1'
        role='dialog'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div class='modal-dialog' role='document'>
          <div class='modal-content'>
            <div class='modal-header'>
              <h5 class='modal-title'>New Folder</h5>
              <button
                type='button'
                class='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div class='modal-body'>
              <form>
                <div class='form-group'>
                  <div class='form-group'>
                    <label>
                      Folder Nickname{' '}
                      <span class='small'>(Used for sharing)</span>
                    </label>
                    <input
                      type='text'
                      class='form-control'
                      name='nickname'
                      value={createFolderFormData.nickname}
                      onChange={onCreateFolderFormDataChange}
                      placeholder='ex: APCS2019STUY'
                    />
                  </div>
                  <div class='form-group'>
                    <label>
                      Password <span class='small'>(Used for sharing)</span>
                    </label>
                    <input
                      type={
                        createFolderFormData.showPassword ? 'text' : 'password'
                      }
                      name='password'
                      value={createFolderFormData.password}
                      onChange={onCreateFolderFormDataChange}
                      class='form-control'
                      placeholder='Password'
                    />
                  </div>
                  <div className='ml-4'>
                    <input
                      type='checkbox'
                      checked={createFolderFormData.showPassword}
                      class='form-check-input'
                      id='exampleCheck1'
                      name='showPassword'
                      onChange={onCreateFolderFormDataChange}
                    />
                    <label class='form-check-label' for='exampleCheck1'>
                      Show password
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <div class='modal-footer'>
              <button
                type='button'
                class='btn btn-secondary'
                data-dismiss='modal'
              >
                Close
              </button>
              <button
                type='button'
                class='btn btn-dark'
                onClick={onSubmitNewFolder}
                data-dismiss='modal'
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class='modal fade'
        id='joinFileModal'
        tabindex='-1'
        role='dialog'
        aria-hidden='true'
      >
        <div class='modal-dialog' role='document'>
          <div class='modal-content'>
            <div class='modal-header'>
              <h5 class='modal-title'>Join Folder</h5>
              <button
                type='button'
                class='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div class='modal-body'>
              <form>
                <div class='form-group'>
                  <div class='form-group'>
                    <label for='exampleInputPassword1'>Folder Nickname</label>
                    <input
                      type='text'
                      class='form-control'
                      placeholder='ex: APCS2019STUY'
                      value={joinFolderFormData.nickname}
                      name='nickname'
                      onChange={onJoinFolderFormDataChange}
                    />
                  </div>
                  <div class='form-group'>
                    <label for='exampleInputPassword1'>Password</label>
                    <input
                      type={
                        joinFolderFormData.showPassword ? 'text' : 'password'
                      }
                      class='form-control'
                      placeholder='Password'
                      value={joinFolderFormData.password}
                      name='password'
                      onChange={onJoinFolderFormDataChange}
                    />
                  </div>
                </div>
                <div className='ml-4'>
                  <input
                    type='checkbox'
                    class='form-check-input'
                    id='exampleCheck1'
                    checked={joinFolderFormData.showPassword}
                    name='showPassword'
                    onChange={onJoinFolderFormDataChange}
                  />
                  <label class='form-check-label' for='exampleCheck1'>
                    Show password
                  </label>
                </div>
              </form>
            </div>
            <div class='modal-footer'>
              <button
                type='button'
                class='btn btn-secondary'
                data-dismiss='modal'
              >
                Close
              </button>
              <button
                type='button'
                class='btn btn-dark'
                data-dismiss='modal'
                onClick={onJoinFolderSubmit}
              >
                Join Folder
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  folders: state.folders
});

export default connect(
  mapStateToProps,
  {
    getFolders,
    createFolder,
    joinFolder
  }
)(Folders);
