import React, { useState, useEffect } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import axios from 'axios';
import openSocket from 'socket.io-client';

import 'brace/mode/java';
import 'brace/theme/monokai';

import './editor.css';

const Editor = () => {
  const [isOwner, changeIsOwner] = useState(true);

  const socket = openSocket('http://localhost:8000');
  socket.emit('subscribe', 1);

  socket.on('receive update', ({ code }) => {
    if (!isOwner) {
      changeCode(code);
    }
  });

  const onCodeChange = code => {
    if (isOwner) {
      socket.emit('update code', {
        room: 1,
        code
      });
      changeCode(code);
    }
  };

  const [code, changeCode] = useState(`public class file {
    public static void main(String[] args) {
        System.out.println("this is a test");
    }
}`);

  const [playgroundCode, changePlaygroundCode] = useState('');

  const [output, changeOutput] = useState('');
  const [playgroundOutput, changePlaygroundOutput] = useState('');

  const runCode = async isMainCode => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post(
        '/api/codeRunner/run',
        {
          language: 'java',
          fileName: 'file.java',
          code: isMainCode ? code : playgroundCode
        },
        config
      );
      isMainCode ? changeOutput(res.data) : changePlaygroundOutput(res.data);
    } catch (err) {}
  };

  return (
    <div className='editor'>
      <div className='row'>
        <AceEditor
          mode='java'
          className='col-6'
          theme='monokai'
          name='blah2'
          onChange={onCodeChange}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={isOwner}
          value={code}
          readOnly={!isOwner}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2
          }}
        />
        <AceEditor
          mode='java'
          className='col-6'
          theme='monokai'
          name='blah2'
          onChange={changePlaygroundCode}
          value={playgroundCode}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2
          }}
        />
      </div>

      <div className='row mt-3'>
        <div className='col-6'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => runCode(true)}
          >
            <i className='fa fa-play' /> Run Code
          </button>{' '}
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => changeIsOwner(false)}
          >
            {isOwner ? 'Teacher' : 'Student'}
          </button>
          <div>
            <br />
            <div
              class='card overflow-auto '
              style={{
                color: 'white',
                backgroundColor: '#272823',
                height: 200
              }}
            >
              <div class='card-body'>
                {output.split('\n').map(line => {
                  return <div>{line}</div>;
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='col-6'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => runCode(false)}
          >
            <i className='fa fa-play' /> Run Code
          </button>
          <div>
            <br />
            <div
              class='card overflow-auto '
              style={{
                color: 'white',
                backgroundColor: '#272823',
                height: 200
              }}
            >
              <div class='card-body'>
                {playgroundOutput.split('\n').map(line => {
                  return <div>{line}</div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
