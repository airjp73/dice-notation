@{%
  const moo = require('moo');
  const lexer = moo.compile({
    ws: /[ \t]+/,
    dice: /\d+d\d+/,
    value: /\d+/,
    times: /\*/,
    plus: /\+/,
    minus: /\-/,
    dividedBy: /\//,
    openParen: '(',
    closeParen: ')',
  });
%}

@lexer lexer

Expression -> %value | %Operation
Operation -> %Expression %operator %Expression