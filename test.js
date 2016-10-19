'use strict';

require('mocha');
var fs = require('fs');
var assert = require('assert');
var parse = require('parse-passwd');
var homedir = require('./');

var user = process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;

describe('homedir-polyfill', function() {
  it('should export a function', function() {
    assert.equal(typeof homedir, 'function');
  });

  it('should return the HOME path', function() {
    if (process.env.HOME) {
      assert.equal(homedir(), process.env.HOME);
    }
  });

  if (process.platform === 'win32') {
    it('should use USERPROFILE', function() {
      if (!process.env.USERPROFILE) {
        process.env.USERPROFILE = 'C:\\Users\\doowb';
      }
      assert.equal(homedir(), 'C:\\Users\\doowb');
    });

    it('should fallback to HOMEDRIVE and HOMEPATH when USERPROFILE is not set', function() {
      delete process.env.USERPROFILE;
      if (!process.env.HOMEDRIVE) {
        process.env.HOMEDRIVE = 'C:';
      }
      if (!process.env.HOMEPATH) {
        process.env.HOMEPATH = '\\Users\\doowb';
      }
      assert.equal(homedir(), 'C:\\Users\\doowb');
    });

    it('should fallback to HOME when HOMEDRIVE, HOMEPATH and USERPROFILE are not set', function() {
      delete process.env.USERPROFILE;
      delete process.env.HOMEDRIVE;
      delete process.env.HOMEPATH;

      process.env.HOME = 'C:\\Users\\doowb';
      assert.equal(homedir(), 'C:\\Users\\doowb');
    });
  }

  if (process.platform === 'darwin') {
    it('should use "/Users/" + username if HOME is not set', function() {
      delete process.env.HOME;
      assert.equal(homedir(), '/Users/' + user);
    });
  }

  if (process.platform === 'linux') {
    it('should lookup the user\'s path from `/etc/passwd` if HOME is not set', function() {
      var uid = typeof process.geteuid === 'function' ? process.geteuid() : process.getuid();

      delete process.env.HOME;
      var users = parse(fs.readFileSync('/etc/passwd', 'utf8'));
      var home;
      for (var i = 0; i < users.length; i++) {
        if (users[i].uid === uid) {
          home = users[i].homedir;
          break;
        }
      }

      assert.equal(homedir(), home || '/home/' + user);
    });
  }
});
