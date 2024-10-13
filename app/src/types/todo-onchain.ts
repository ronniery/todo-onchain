/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/todo_onchain.json`.
 */
export type TodoOnchain = {
  address: '3frmuBcq8XhKsPCLYNr9cUoSr83y8kdj91bMptsDSaVp';
  metadata: {
    name: 'todoOnchain';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'addTodo';
      discriminator: [188, 16, 45, 145, 4, 5, 188, 75];
      accounts: [
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'userProfile';
          writable: true;
        },
        {
          name: 'todoAccount';
          writable: true;
        },
        {
          name: 'systemProgram';
        },
      ];
      args: [
        {
          name: 'content';
          type: 'string';
        },
      ];
    },
    {
      name: 'initializeUser';
      discriminator: [111, 17, 185, 250, 60, 122, 38, 254];
      accounts: [
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'userProfile';
          writable: true;
        },
        {
          name: 'systemProgram';
        },
      ];
      args: [];
    },
    {
      name: 'markTodo';
      discriminator: [70, 24, 206, 243, 92, 29, 249, 110];
      accounts: [
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
        },
        {
          name: 'userProfile';
          writable: true;
        },
        {
          name: 'todoAccount';
          writable: true;
        },
      ];
      args: [
        {
          name: 'todoIdx';
          type: 'u8';
        },
      ];
    },
    {
      name: 'removeTodo';
      discriminator: [28, 167, 91, 69, 25, 225, 253, 117];
      accounts: [
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
        },
        {
          name: 'userProfile';
          writable: true;
        },
        {
          name: 'todoAccount';
          writable: true;
        },
      ];
      args: [
        {
          name: 'todoIdx';
          type: 'u8';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'todoAccount';
      discriminator: [31, 86, 84, 40, 187, 31, 251, 132];
    },
    {
      name: 'userProfile';
      discriminator: [32, 37, 119, 205, 179, 180, 13, 194];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'unauthorized';
      msg: 'You are not authorized to perform this action.';
    },
    {
      code: 6001;
      name: 'notAllowed';
      msg: 'Not allowed';
    },
    {
      code: 6002;
      name: 'mathOverflow';
      msg: 'Math operation overflow';
    },
    {
      code: 6003;
      name: 'alreadyMarked';
      msg: 'Already marked';
    },
  ];
  types: [
    {
      name: 'todoAccount';
      docs: [
        'The `TodoAccount` struct represents an individual to-do item for a user.',
        'It contains metadata about the to-do item, including content,',
        'its index, and whether it has been marked as completed.',
      ];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            docs: [
              "The public key (`Pubkey`) of the account's authority,",
              'representing the wallet or user who owns this to-do item.',
              'This ensures that only the user who created the to-do item',
              'can update or modify it.',
            ];
            type: 'pubkey';
          },
          {
            name: 'idx';
            docs: [
              'The index (`u8`) of the to-do item in relation to other items',
              'created by the same user. This helps uniquely identify the to-do',
              "within the user's profile and provides an ordered list of tasks.",
            ];
            type: 'u8';
          },
          {
            name: 'content';
            docs: [
              'A string that holds the content of the to-do item.',
              'This is the main task description or detail that the user',
              'wants to track in their to-do list.',
              'Example: "Buy groceries" or "Complete project."',
            ];
            type: 'string';
          },
          {
            name: 'marked';
            docs: [
              'A boolean (`bool`) flag indicating whether the to-do item',
              'has been marked as completed.',
              '- `true`: The task is marked as complete.',
              '- `false`: The task is still pending or in progress.',
            ];
            type: 'bool';
          },
        ];
      };
    },
    {
      name: 'userProfile';
      docs: [
        "The `UserProfile` struct represents a user's profile on the dApp.",
        "It stores essential information related to the user's authority and their",
        'interactions with the to-do list functionality.',
      ];
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            docs: [
              "The public key (`Pubkey`) of the account's authority,",
              'which represents the wallet or user controlling this profile.',
              'This is typically the owner of the Solana account that created',
              'this profile and has the permission to modify it.',
            ];
            type: 'pubkey';
          },
          {
            name: 'lastTodo';
            docs: [
              'The index (`u8`) of the last to-do item created by this user.',
              'It acts as a pointer to the most recently added to-do item',
              'and helps with tracking sequential task creation.',
              'This value can be updated whenever a new to-do is added.',
            ];
            type: 'u8';
          },
          {
            name: 'todoCount';
            docs: [
              'The total number (`u8`) of to-do items created by the user.',
              'This counter tracks how many tasks the user has created overall.',
              'It is incremented each time a new to-do item is added,',
              "providing a summary of the user's activity on the to-do list.",
            ];
            type: 'u8';
          },
        ];
      };
    },
  ];
  constants: [
    {
      name: 'todoTag';
      type: 'bytes';
      value: '[84, 79, 68, 79, 95, 83, 84, 65, 84, 69]';
    },
    {
      name: 'userTag';
      type: 'bytes';
      value: '[85, 83, 69, 82, 95, 83, 84, 65, 84, 69]';
    },
  ];
};
