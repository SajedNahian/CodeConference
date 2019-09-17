import React, { useEffect, useState, Fragment } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/monokai';
import './editor.css';
import { getFolder, addFile } from './../actions/folder';
import { connect } from 'react-redux';
import Spinner from './Spinner';
import OwnerEditor from './OwnerEditor';
import { loadFile } from '../actions/file';

const Folder = ({
  match,
  getFolder,
  addFile,
  folder: {
    folder: { isOwner, files },
    loading
  },
  loadFile,
  file: fileState
}) => {
  const { folderId } = match.params;
  useEffect(() => {
    getFolder(folderId);
  }, []);

  const [newFileForm, changeNewFileForm] = useState({
    fileName: '',
    language: 'java'
  });

  const onChangeNewFileForm = e => {
    changeNewFileForm({
      ...newFileForm,
      [e.target.name]: e.target.value
    });
  };

  const getFile = fileId => {
    loadFile(folderId, fileId);
  };

  const { fileName, language } = newFileForm;

  const onSubmitAddFile = () => {
    addFile(folderId, newFileForm);
    changeNewFileForm({
      fileName: '',
      language: 'java'
    });
  };

  if (loading) {
    return <Spinner />;
  }

  const isFileMatch = fileName => {
    return fileState.file !== null && fileState.file.fileName == fileName;
  };

  return (
    <div className='row mt-4'>
      <div className='col-2 text-center'>
        <h2>APCS</h2>
        <button
          className='btn btn-dark col-8'
          data-toggle='modal'
          data-target='#joinFileModal'
        >
          New file
        </button>
        <h4 class='text-left mt-4 ml-3'>Files</h4>
        {files.length == 0 ? (
          <em>No files found. Please add one to get started</em>
        ) : (
          <ul class='list-group text-left mt-2 ml-3'>
            {files.map(file => (
              <li
                class={
                  isFileMatch(file.fileName)
                    ? 'list-group-item active'
                    : 'list-group-item'
                }
                onClick={() => getFile(file._id)}
                style={{ cursor: 'pointer' }}
              >
                {file.fileName}
              </li>
            ))}
          </ul>
        )}
        {false && (
          <Fragment>
            <h4 class='text-left mt-4 ml-3'>Students</h4>
            <ul class='list-group text-left mt-2 ml-3'>
              <li class='list-group-item active'>Sajed Nahian</li>
              <li class='list-group-item'>Robin Han</li>
              <li class='list-group-item'>Robin Han</li>
              <li class='list-group-item'>Robin Han</li>
              <li class='list-group-item'>Robin Han</li>
              <li class='list-group-item'>Robin Han</li>
              <li class='list-group-item'>Robin Han</li>
            </ul>
          </Fragment>
        )}
      </div>
      {isOwner ? <OwnerEditor /> : null}
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
              <h5 class='modal-title'>New File</h5>
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
                    <label for='exampleInputPassword1'>File Name</label>
                    <input
                      type='text'
                      class='form-control'
                      placeholder='ex: Main.java'
                      name='fileName'
                      value={fileName}
                      onChange={onChangeNewFileForm}
                    />
                  </div>
                  <div class='form-group'>
                    <label for='sel1'>Select list (select one):</label>
                    <select
                      class='form-control'
                      id='sel1'
                      name='language'
                      onChange={onChangeNewFileForm}
                    >
                      <option value='java'>Java</option>
                      <option value='python'>Python</option>
                    </select>
                    {fileName !== '' && (
                      <p>
                        File will be called {fileName}.
                        {language == 'python' ? 'py' : 'java'}
                      </p>
                    )}
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
                data-dismiss='modal'
                onClick={onSubmitAddFile}
              >
                Create File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  folder: state.folder,
  file: state.file
});

export default connect(
  mapStateToProps,
  {
    getFolder,
    addFile,
    loadFile
  }
)(Folder);
