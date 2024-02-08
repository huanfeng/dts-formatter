#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# License: BSD-2-CLAUSE
# Copyright <2024> <Isaev Ruslan>

import re
import sys

class DtsFormatter:
    def __init__(self, tab_char="tab", tab_size=1):
        if tab_char == "tab":
            tab_char = "\t"
        else:
            tab_char = " "

        self.tab_str = tab_char * tab_size

    def format_string(self, data, path=''):
        output = []
        tab = 0

        for line, record in enumerate(re.split('\n', data), start=1):
            token_comment_start = record.find('//')
            comment_token = ''
            if token_comment_start != -1:
                comment_token = record[token_comment_start:]  # Save the comment token
                record = record[:token_comment_start]        # Remove the comment token from the code

            code_token = record.strip()

            # Processing preprocessor directive tokens
            if code_token.startswith('#if') or code_token.startswith('#else') or code_token.startswith('#endif'):
                output.append(record + comment_token)
                continue

            # Processing brace tokens and indentation
            open_brace_tokens = code_token.count('{')
            close_brace_tokens = code_token.count('}')
            tab -= close_brace_tokens
            tab = max(0, tab)
            output.append((self.tab_str * tab) + code_token + comment_token)
            tab += open_brace_tokens

        error = (tab != 0)
        if error:
            sys.stderr.write('File %s: error: brace mismatch: %d.\n' % (path, tab))
        return '\n'.join(output), error

def main():
    error = False
    tab_char = "tab"
    tab_size = 1

    # Parse command line arguments
    if len(sys.argv) > 1:
        tab_char = sys.argv[1] if len(sys.argv) > 2 else "tab"
        tab_size = int(sys.argv[2]) if len(sys.argv) > 3 else 1

    formatter = DtsFormatter(tab_char, tab_size)

    # Read from stdin
    data = sys.stdin.read()
    result, error = formatter.format_string(data)

    if not error:
        sys.stdout.write(result)
    else:
        error = True

    if error:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == '__main__':
    main()
