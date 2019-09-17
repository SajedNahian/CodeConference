const runCode = async (language, fileName, code, callback) => {
  console.log(code.split(' '));
  console.log(
    code
      .replace(/\n/g, '\\n')
      .replace(/"/g, '\\"')
      .replace(/</g, '"<"')
      .replace(/>/g, '">"')
      .replace(/    /g, '\\t')
  );
  const command = `java code_runner ${code
    .replace(/\n/g, '\\n')
    // .replace(/\t/g, '\\t')
    .replace(/"/g, '\\"')
    .replace(/</g, '"<"')
    .replace(/>/g, '">"')
    .replace(/^ {4}/g, '\\t')} ${fileName} ${language}`;

  // .replace(/[\t\n]+/g, ' ')
  // .replace(/"/g, '\\"')
  // .replace(/</g, '"<"')
  // .replace(/>/g, '">"')

  // console.log(command);
  require('child_process').exec(command, (error, stdout, stderr) => {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    return callback(stdout);
  });
};

module.exports = runCode;
