'use strict';

/**
 * These tests are version to ensure that the correct methods are run for different platforms
 * and different node versions.
 */

require('mocha');
var fs = require('fs');
var os = require('os');
var assert = require('assert');
var parse = require('parse-passwd');
var homedir = require('./');

var user = process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;

describe('homedir-polyfill', function() {
  it('should export a function', function() {
    assert.equal(typeof homedir, 'function');
    if (typeof os.homedir === 'function') {
      assert.equal(homedir, os.homedir);
    }
  });

  it('should return the HOME path', function() {
    if (process.env.HOME) {
      var expected = typeof os.homedir === 'function' ? os.homedir() : process.env.HOME;
      assert.equal(homedir(), expected);
    }
  });

  if (process.platform === 'win32') {
    it('should use USERPROFILE', function() {
      process.env.USERPROFILE = 'C:\\Users\\doowb';
      var expected = typeof os.homedir === 'function' ? os.homedir() : process.env.USERPROFILE;
      assert.equal(homedir(), expected);
    });

    it('should fallback to HOMEDRIVE and HOMEPATH when USERPROFILE is not set', function() {
      delete process.env.USERPROFILE;
      process.env.HOMEDRIVE = 'C:';
      process.env.HOMEPATH = '\\Users\\doowb';
      var expected = typeof os.homedir === 'function' ? os.homedir() : process.env.HOMEDRIVE + process.env.HOMEPATH;
      assert.equal(homedir(), expected);
    });

    it('should fallback to HOME when HOMEDRIVE, HOMEPATH and USERPROFILE are not set', function() {
      delete process.env.USERPROFILE;
      delete process.env.HOMEDRIVE;
      delete process.env.HOMEPATH;

      process.env.HOME = 'C:\\Users\\doowb';

      var expected = typeof os.homedir === 'function' ? os.homedir() : process.env.HOME;
      assert.equal(homedir(), expected);
    });
  }

  if (process.platform === 'darwin') {
    it('should use "/Users/" + username if HOME is not set', function() {
      delete process.env.HOME;
      var expected = typeof os.homedir === 'function' ? os.homedir() : '/Users/' + user;
      assert.equal(homedir(), expected);
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

      var expected = typeof os.homedir === 'function' ? os.homedir() : (home || '/home/' + user);
      assert.equal(homedir(), expected);
    });
  }
});
