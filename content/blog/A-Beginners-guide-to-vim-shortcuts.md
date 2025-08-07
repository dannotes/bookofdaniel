+++
title = 'A Beginners Guide to Vim Shortcuts'
date = '2024-09-12T13:31:52+05:30'
draft = false
categories = ['Tech']
+++

Vim is a highly configurable text editor used in programming. It's known for its efficiency, enabling users to navigate and edit documents with minimal use of the mouse. This blog post will introduce you to the most important Vim shortcuts and commands, making your coding journey smoother and more efficient.

## Understanding Vim Modes

Before we dive into the commands, it's crucial to understand Vim's modes. Vim operates in several modes, each with a specific purpose:

- **Normal Mode**: The default mode when you open Vim. It's used to execute commands.
- **Insert Mode**: Allows you to insert text into your document.
- **Visual Mode**: Used for selecting lines, blocks, and text in your document.
- **Command-Line Mode**: Allows you to enter Vim commands and/or search for text.

You can switch between these modes using various commands, which we'll cover in the following sections[1][2][4][9].

## Cursor Movement

In normal mode, you can move the cursor around with the following commands:

- `h`: move cursor left
- `j`: move cursor down
- `k`: move cursor up
- `l`: move cursor right
- `w`: jump forwards to the start of a word
- `b`: jump backwards to the start of a word
- `0`: jump to the start of the line
- `$`: jump to the end of the line
- `gg`: go to the first line of the document
- `G`: go to the last line of the document

## Insert Mode

To enter insert mode from normal mode, use the following commands:

- `i`: enter insert mode before the cursor
- `a`: enter insert mode after the cursor
- `A`: enter insert mode at the end of the line
- `o`: open a new line below the current line and enter insert mode
- `O`: open a new line above the current line and enter insert mode

To return to normal mode from insert mode, press `Esc`.

## Visual Mode

To select text, you can switch to visual mode using these commands:

- `v`: enter visual mode
- `V`: enter linewise visual mode
- `Ctrl + v`: enter blockwise visual mode

## Cut, Copy, and Paste

Vim uses different terminology for these operations:

- `x`: delete character under the cursor
- `dd`: delete line
- `D`: delete from cursor to end of line
- `yy`: yank (copy) line
- `p`: paste after the cursor
- `P`: paste before the cursor

## Undo and Redo

To undo or redo changes, use the following commands:

- `u`: undo
- `Ctrl + r`: redo

## Search and Replace

Vim provides powerful search and replace functionality:

- `/pattern`: search for a pattern
- `n`: move to the next match
- `N`: move to the previous match
- `:%s/old/new/g`: replace all occurrences of 'old' with 'new' in the entire file

## File Operations

You can perform various file operations using these commands:

- `:e {file}`: edit another file
- `:w`: write (save) file
- `:wq`: write file and exit
- `:q!`: exit without saving

## Miscellaneous

Here are some additional useful commands:

- `:help {keyword}`: open help for a keyword
- `:set number`: show line numbers
- `:set nonumber`: hide line numbers
- `:split {file}`: split the window horizontally and open a file
- `:vsplit {file}`: split the window vertically and open a file
- `Ctrl + w + arrow keys`: navigate between split windows

This guide covers the most commonly used Vim commands. As you become more proficient with Vim, you can explore additional commands and functionalities. Happy coding!

## References:
- [1] https://www.linuxfoundation.org/blog/blog/classic-sysadmin-vim-101-a-beginners-guide-to-vim
- [2] https://opensource.com/article/19/3/getting-started-vim
- [3] https://www.reddit.com/r/vim/comments/166q64q/an_effective_beginner_vim_tutorial_focusing_on/
- [4] https://coderwall.com/p/adv71w/basic-vim-commands-for-getting-started
- [5] https://youtube.com/watch?v=ggSyF1SVFr4
- [6] https://danielmiessler.com/p/vim/
- [7] https://www.unomaha.edu/college-of-information-science-and-technology/computer-science-learning-center/_files/resources/CSLC-Helpdocs-Vim.pdf
- [8] https://www.reddit.com/r/vim/comments/lbjw3u/good_guides_on_vim/
- [9] https://www.freecodecamp.org/news/vim-beginners-guide/
- [10] https://www.reddit.com/r/vim/comments/k60da0/best_vim_tutorial_for_beginners/
- [11] https://vim.rtorr.com
- [12] https://www.howtoforge.com/vim-basics
- [13] https://thevaluable.dev/vim-commands-beginner/
- [14] https://youtube.com/watch?v=RZ4p-saaQkc
- [15] https://linuxhandbook.com/basic-vim-commands/