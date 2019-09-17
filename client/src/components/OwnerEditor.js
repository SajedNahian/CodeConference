import React, { Fragment, useState } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import axios from 'axios';
import 'brace/mode/java';
import 'brace/mode/python';
import 'brace/theme/monokai';
import { connect } from 'react-redux';
import Spinner from './Spinner';

const OwnerEditor = ({ file }) => {
  const [currentFile, changeCurrentFile] = useState('');
  const [mainCodeInit, changeMainCodeInit] = useState(false);
  const [mainCode, changeMainCode] = useState('');
  const [output, changeOutput] = useState('');
  const [codeRunning, changeCodeRunning] = useState(false);

  if (file.file && !mainCodeInit) {
    changeMainCode(file.file.textContent);
    changeCurrentFile(file.file._id);
    changeMainCodeInit(true);
  }

  if (file.file && file.file._id !== currentFile) {
    changeMainCode(file.file.textContent);
    changeCurrentFile(file.file._id);
  }

  const runCode = async () => {
    changeCodeRunning(true);
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post(
      '/api/codeRunner/run',
      {
        language: file.file.language,
        fileName: file.file.fileName,
        code: mainCode
      },
      config
    );

    changeOutput(res.data);
    changeCodeRunning(false);
  };

  const onMainEditorChange = value => {
    changeMainCode(value);
  };
  console.log(file.file ? file.file.language : 'java');
  return (
    <Fragment>
      <div className='col-6'>
        <AceEditor
          mode={file.file ? file.file.language : 'java'}
          style={{ width: '100%' }}
          theme='monokai'
          name='blah2'
          onChange={onMainEditorChange}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={mainCodeInit ? mainCode : ''}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 4
          }}
        />
        <button
          className={'btn btn-success mt-1' + (codeRunning ? ' disabled' : '')}
          onClick={runCode}
        >
          <i class='fa fa-play' /> Run Code
        </button>
        <div
          class='card overflow-auto mt-2'
          style={{
            color: 'white',
            height: 200,
            backgroundColor: '#272823'
          }}
        >
          <div
            class='card-body'
            style={{
              'overflow-y': 'scroll'
            }}
          >
            {output.split('\n').map(line => {
              return <div>{line}</div>;
            })}
          </div>
        </div>
      </div>
      <div className='col-4'>
        <AceEditor
          mode='java'
          style={{ width: '100%', height: '100%', padding: 0 }}
          theme='monokai'
          name='blah2'
          onChange={() => {}}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={''}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2
          }}
        />
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  file: state.file
});

export default connect(mapStateToProps)(OwnerEditor);
