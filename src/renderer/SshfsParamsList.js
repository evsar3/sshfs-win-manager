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
  },
  {
    name: 'allow_other',
    type: 'bool',
    description: 'Allow access to other users'
  },
  {
    name: 'allow_root',
    type: 'bool',
    description: 'Allow access to root'
  },
  {
    name: 'nonempty',
    type: 'bool',
    description: 'Allow mounts over non-empty file/dir'
  },
  {
    name: 'default_permissions',
    type: 'bool',
    description: 'Enable permission checking by kernel'
  },
  {
    name: 'fsname',
    type: 'string',
    description: 'Set filesystem name'
  },
  {
    name: 'subtype',
    type: 'string',
    description: 'Set filesystem type'
  },
  {
    name: 'large_read',
    type: 'bool',
    description: 'Issue large read requests (2.4 only)'
  },
  {
    name: 'max_read',
    type: 'number',
    description: 'Set maximum size of read requests'
  },
  {
    name: 'hard_remove',
    type: 'bool',
    description: 'Immediate removal (don\'t hide files)'
  },
  {
    name: 'use_ino',
    type: 'bool',
    description: 'Let filesystem set inode numbers'
  },
  {
    name: 'readdir_ino',
    type: 'bool',
    description: 'Try to fill in d_ino in readdir'
  },
  {
    name: 'direct_io',
    type: 'bool',
    description: 'Use direct I/O'
  },
  {
    name: 'kernel_cache',
    type: 'bool',
    description: 'Cache files in kernel'
  },
  {
    name: 'auto_cache',
    type: 'bool',
    description: 'Enable caching based on modification times'
  },
  {
    name: 'umask',
    type: 'number',
    description: 'Set file permissions (octal)'
  },
  {
    name: 'uid',
    type: 'number',
    description: 'Set file owner'
  },
  {
    name: 'gid',
    type: 'number',
    description: 'Set file group'
  },
  {
    name: 'entry_timeout',
    type: 'number',
    description: 'Cache timeout for names (1.0s)'
  },
  {
    name: 'negative_timeout',
    type: 'number',
    description: 'Cache timeout for deleted names (0.0s)'
  },
  {
    name: 'attr_timeout',
    type: 'number',
    description: 'Cache timeout for attributes (1.0s)'
  },
  {
    name: 'ac_attr_timeout',
    type: 'number',
    description: 'Auto cache timeout for attributes (attr_timeout)'
  },
  {
    name: 'intr',
    type: 'bool',
    description: 'Allow requests to be interrupted'
  },
  {
    name: 'intr_signal',
    type: 'number',
    description: 'Signal to send on interrupt (10)'
  },
  {
    name: 'modules',
    type: 'string',
    description: 'Names of modules to push onto filesystem stack'
  },
  {
    name: 'max_write',
    type: 'number',
    description: 'Set maximum size of write requests'
  },
  {
    name: 'max_readahead',
    type: 'number',
    description: 'Set maximum readahead'
  },
  {
    name: 'async_read',
    type: 'bool',
    description: 'Perform reads asynchronously (default)'
  },
  {
    name: 'sync_read',
    type: 'bool',
    description: 'Perform reads synchronously'
  }
]
