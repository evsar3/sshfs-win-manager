export default [
  {
    name: 'reconnect',
    type: 'bool',
    description: 'Reconnect to server'
  },
  {
    name: 'delay_connect',
    type: 'bool',
    description: 'Delay connection to server'
  },
  {
    name: 'sshfs_sync',
    type: 'bool',
    description: 'Synchronous writes'
  },
  {
    name: 'no_readahead',
    type: 'bool',
    description: 'Synchronous reads (no speculative readahead)'
  },
  {
    name: 'sshfs_debug',
    type: 'bool',
    description: 'Print some debugging information'
  },
  {
    name: 'cache',
    type: 'string',
    description: 'Enable caching {yes,no} (default: yes)'
  },
  {
    name: 'cache_timeout',
    type: 'number',
    description: 'Sets timeout for caches in seconds (default: 20)'
  },
  {
    name: 'cache_stat_timeout',
    type: 'number',
    description: 'Sets timeout for stat cache'
  },
  {
    name: 'cache_dir_timeout',
    type: 'number',
    description: 'Sets timeout for dir cache'
  },
  {
    name: 'cache_link_timeout',
    type: 'number',
    description: 'Sets timeout for link cache'
  },
  {
    name: 'workaround',
    type: 'string',
    description: 'Colon separated list of workarounds'
  },
  {
    name: 'idmap',
    type: 'string',
    description: 'User/group ID mapping'
  },
  {
    name: 'oidfile',
    type: 'string',
    description: 'File containing username:uid mappings for idmap=file'
  },
  {
    name: 'gidfile',
    type: 'string',
    description: 'File containing groupname:gid mappings for idmap=file'
  },
  {
    name: 'nomap',
    type: 'string',
    description: 'With idmap=file, how to handle missing mappings'
  },
  {
    name: 'ssh_command',
    type: 'string',
    description: 'Execute CMD instead of "ssh"'
  },
  {
    name: 'ssh_protocol',
    type: 'string',
    description: 'SSH protocol to use (default: 2)'
  },
  {
    name: 'sftp_server',
    type: 'string',
    description: 'Path to SFTP server or subsystem (default: sftp)'
  },
  {
    name: 'directport',
    type: 'number',
    description: 'Directly connect to port bypassing SSH -o slave communicate over stdin and stdout bypassing network'
  },
  {
    name: 'transform_symlinks',
    type: 'bool',
    description: 'Transform absolute symlinks to relative'
  },
  {
    name: 'follow_symlinks',
    type: 'bool',
    description: 'Follow symlinks on the server'
  },
  {
    name: 'no_check_root',
    type: 'bool',
    description: 'Don\'t check for existence of "dir" on server'
  }
]
