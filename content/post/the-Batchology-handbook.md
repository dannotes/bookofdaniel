+++
title = "The Batchology Handbook"
date = '2024-09-12T13:59:37+05:30'
categories = ['Tech']
draft = false
+++

Hello there! If you've ever wondered how to make your computer tasks faster and more efficient, you're in the right place. This blog post is all about Batch scripting - a simple yet powerful way to automate tasks in Windows.

Whether you're new to programming or have some experience, "The Batchology Handbook" is designed to be easy to follow and understand. We'll start with the basics, like setting up your workspace, and gradually move into more exciting stuff, like automating file management and using cool commands you might not know about.

Batch scripting might sound a bit technical, but I promise to keep things light and straightforward. You'll find practical examples that you can try out yourself, and I'll explain everything step by step. By the end of this guide, you'll be amazed at how much you can do with just a few simple commands.

So, let's get started and explore the world of Batch scripting together!

# 1. Introduction
Batch programming, also known as batch scripting, is a method of automating repetitive tasks in the Windows operating system. This is achieved through the creation of a batch file, a text file containing a series of commands to be executed by the command-line interpreter. Batch files are identified by their `.bat` or `.cmd` extension.
### Purpose
The primary purpose of batch programming is to simplify the execution of multiple commands. It's a powerful tool for system administrators, developers, and power users to automate routine tasks like file management, software installation, and system configuration.
### Advantages
- Efficiency: Automates repetitive tasks, saving time and effort.
- Ease of Use: Requires no special programming skills, making it accessible for beginners.
- Flexibility: Can be combined with other scripts and programs for more complex operations.
- Resource-Friendly: Consumes minimal system resources.

### Basic Components
- Command Prompt: The environment where batch files are executed.
- Commands: Instructions executed sequentially in a batch file.
- Scripting Elements: Include loops, conditional statements, and variables.

---
# 2. Requirements
Batch programming doesn't require any additional software installations on Windows operating systems as it utilizes the built-in Command Prompt. However, to create and edit batch files efficiently, the following are recommended:
- **Windows OS**: Any modern version (Windows 7, 8, 10, or 11).
- **Text Editor**: Notepad (built-in), Notepad++, or any other preferred text editor, Recommended: Visual Studio Code.

### Configuring the Command Prompt
While not strictly necessary, configuring the Command Prompt for better usability can enhance the batch scripting experience:
- **Accessing Command Prompt**:
	- Press `Win + R`, type `cmd`, and press Enter.
	- Alternatively, search for "Command Prompt" in the start menu.
- **Customization** (Optional):
	- Right-click the title bar of the Command Prompt window.
	- Choose 'Properties' to adjust settings like font size, layout, and color scheme for better visibility.

### Creating Your First Batch File
- **Open a Text Editor**: Right-click on your desktop or in any folder, select "New" > "Text Document."
- **Enter a Simple Command**: For example, type `echo Hello, world!`.
- **Save the File with a .bat Extension**: Click 'File' > 'Save As', name your file (e.g., `HelloWorld.bat`), and change the 'Save as type' to 'All Files'. Ensure the filename ends with `.bat`.
- **Run Your Batch File**: Double-click the file to execute or run it from the Command Prompt.

### Setting File Associations (Optional)
- If double-clicking the `.bat` file doesn't execute it, ensure that `.bat` files are associated with the Command Prompt:
- Right-click on a `.bat` file and select 'Open with' > 'Choose another app.'
- Select 'More apps', scroll down, and choose 'Look for another app on this PC.'
- Navigate to `C:\Windows\System32` and select `cmd.exe`.

### Tips
- **File Locations**: Store your batch files in a dedicated folder for easy management.
- **Testing**: Always test new scripts in a controlled environment to prevent unintended actions.

---

# 3. Basic Commands
Batch files execute a series of Command Prompt commands. Here, we'll explore some fundamental commands that form the building blocks of batch scripting.

| Command | Purpose                                          | Example               | Description                                  |
|---------|--------------------------------------------------|-----------------------|----------------------------------------------|
| Echo    | Displays messages or turns command echoing on/off. | `echo Hello, world!`  | Displays "Hello, world!" in Command Prompt.  |
| REM     | Adds comments in the script for readability.     | `REM This is a comment` | Ignored during execution, used for notes.    |
| SET     | Creates or changes environment variables.        | `SET name=John`      | Sets the value of `name` to "John."          |
| GOTO    | Directs the script to another section.           | `GOTO END`            | Jumps to the label `:END` in the script.     |
| Labels  | Marks a section of the script.                   | `:END`                | Used with `GOTO` to create script sections.  |
| PAUSE   | Pauses the script, waiting for a key press.      | `PAUSE`               | Used for testing or script pauses.           |
| EXIT    | Exits the Command Prompt or a script.            | `EXIT`                | Closes the Command Prompt window in a script.|


### Sample Batch File
```cmd
 @ECHO OFF
 REM Sample batch script
 SET name=John
 echo Hello, %name%!
 PAUSE
 GOTO END
 
 :END
 echo Script is ending...
 EXIT
```
This script introduces basic commands, including setting a variable, displaying messages, and controlling the script flow.

---

# 4. Advanced Scripting Techniques
After mastering basic commands, you can enhance your batch scripts with more sophisticated techniques. These advanced methods allow for greater flexibility and functionality in your scripts.


### Using Variables
- **Dynamic Variable Assignment**:Variables can be set based on user input or other commands.
    - Example: `SET /P username=Enter your username: `This command prompts the user to enter a username, which is stored in the `username` variable.
- **Manipulating Strings**: Batch scripts support basic string manipulation.
	- Example: `SET fullname=%firstname% %lastname%`
			  Concatenates two variables to create a full name.  
	
### Conditional Statements
- **IF Command**: Used for making decisions in scripts.
	- Syntax: `IF [condition] [command]`
	- Example: `IF %age% LEQ 18 echo You are a minor.`
			  Checks if the value of `age` is less than or equal to 18.  
- **Using ELSE**: To specify an alternative action if the IF condition is false.
    - Example: `IF %number% EQU 10 (echo Number is 10) ELSE (echo Number is not 10)`
### Loops
- **FOR Command**: Executes a command for each item in a set.
	- Syntax: `FOR %%parameter IN (set) DO command`
	- Example: `FOR %%G IN (*.txt) DO echo %%G`
			  This will echo the name of each `.txt` file in the current directory.  
### Subroutines
- **CALL Command**: Calls another batch file or a label within the same file.
	- Example: `CALL :subroutine`
			  Calls a label named `:subroutine` within the script.  
	- Creating a Subroutine:
		- Example:
        ```cmd
        :subroutine
		echo This is a subroutine.
		GOTO :EOF
        ```
### Error Handling
- **ErrorLevel**: Used to check the status of the last executed command.
	- Example: `IF %ERRORLEVEL% NEQ 0 echo Error occurred.`
- **Using `EXIT /B`**: Exits the script or subroutine without closing the Command Prompt.
	- Example: `EXIT /B 1`
		Exits the subroutine or script and sets the `ErrorLevel` to 1.  
### Delay Execution
- **TIMEOUT Command**: Pauses the script for a specified number of seconds.
- Example: `TIMEOUT /T 10`
			  Pauses the script for 10 seconds.  


### Sample Advanced Batch File
```cmd	  
@ECHO OFF
SET /P userinput=Enter a number: 
IF %userinput% EQU 10 (
    echo The number is 10.
) ELSE (
	echo The number is not 10.
)
		  
FOR %%G IN (*.docx) DO echo Found document: %%G
CALL :subroutine
EXIT
		  
:subroutine
echo This is a subroutine.
GOTO :EOF
```
This script combines various advanced techniques, showcasing conditional logic, loops, subroutines, and user input.  

### Conclusion
Advanced scripting techniques in batch programming significantly enhance the capabilities of your scripts, allowing you to automate more complex tasks and handle various scenarios efficiently.

---

# 4. File Operations
File operations are crucial in batch programming for managing files and directories. This section covers commands to perform various file operations such as creating, copying, moving, and deleting files and directories.
### Creating Files and Directories
- Creating a New File:
	- Command: `type nul > filename.ext`
	- Example: `type nul > example.txt`
			  Creates an empty file named `example.txt`.  
- Creating a Directory:
	- Command: `mkdir directoryname`
	- Example: `mkdir MyFolder`
			  Creates a new directory named `MyFolder`.  

### Copying Files and Directories
- Copying a File:
	- Command: `copy source destination`
	- Example: `copy example.txt D:\Backup\example.txt`
			  Copies `example.txt` to the `D:\Backup` directory.  
- Copying a Directory:
	- Command: `xcopy source destination /E /H /C /I`
	- Example: `xcopy MyFolder D:\Backup\MyFolder /E /H /C /I`
			  Recursively copies `MyFolder` to `D:\Backup`, including hidden files and subdirectories.  

### Moving and Renaming Files and Directories
- Moving a File:
	- Command: `move source destination`			
    - Example: `move example.txt D:\Archive`
			  Moves `example.txt` to `D:\Archive`.  
- Renaming a File or Directory:
	- Command: `ren oldname newname`
	- Example: `ren example.txt new_example.txt`
			  Renames `example.txt` to `new_example.txt`.  

### Deleting Files and Directories
- Deleting a File:
	- Command: `del filename`
	- Example: `del example.txt`
			  Deletes `example.txt`.  
- Deleting a Directory:
		- Command: `rmdir /S /Q directoryname`
		- Example: `rmdir /S /Q MyFolder`
			  Deletes `MyFolder` and all of its contents.  

### Working with File Attributes
- Changing File Attributes:
    - Command: `attrib [+|-][R|A|S|H] filename`
    - Example: `attrib +R example.txt`
		  Sets the read-only attribute to `example.txt`.  

### Sample Script for File Operations
```cmd	  
  @ECHO OFF
  mkdir MyDocuments
  type nul > MyDocuments\doc1.txt
  xcopy MyDocuments D:\Backup\MyDocuments /E /H /C /I
  move MyDocuments\doc1.txt MyDocuments\document.txt
  del MyDocuments\doc1.txt
  rmdir /S /Q MyDocuments
```
This script demonstrates creating a directory and a file, copying the directory, renaming a file, deleting the file, and finally deleting the directory.  

### Conclusion
Understanding file operations in batch programming is essential for effective script writing, especially when handling bulk file management tasks. These operations lay the foundation for automating routine file management tasks in a Windows environment.

---

# 5. Cool Commands
In addition to basic file operations and scripting techniques, batch programming offers a plethora of "cool commands" that can be used for a wide range of purposes, from system administration to advanced file manipulation. Let's explore some of these commands and their functionalities.

| Command | Purpose | Usage | Reference Link |
|---|---|---|---|
| FC | Compares two files and displays the differences. | `FC file1 file2` | [🔗](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/fc) |
| FORFILES | Executes a command on each file in a set of files. | `FORFILES /P directory /M searchmask /C cmd` | [🔗](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/forfiles) |
| HELP | Provides help information for batch commands. | `HELP command` | [🔗](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/help) |
| MSG | Sends a message to a user or session. | `MSG [username]` | [🔗](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/msg) |
| PROMPT | Changes the command prompt. | `PROMPT [text]` | [🔗](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/prompt) |
| QUERY | Displays the status of a specified service/session. | `QUERY session` | [🔗](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/query) |
| REG | Manages registry keys and values. | `REG QUERY key` | [🔗](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/reg-query) |
| RUNAS | Executes a program under a different user account. | `RUNAS /USER:user program` | [🔗](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc771525(v=ws.11)) |
| SC | Manages Windows services. | `SC command service_name` | [🔗](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc754599(v=ws.11)) |
| SCHTASKS | Schedules commands/programs to run periodically. | `SCHTASKS /CREATE /SC schedule /TN task /TR run` | [🔗](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc725744(v=ws.11)) |
| SHORTCUT | Creates a Windows shortcut. | `SHORTCUT /F:filename /A:C /T:targetpath` | [🔗](https://ss64.com/nt/shortcut.html) |
| SHUTDOWN | Shuts down or restarts a computer. | `SHUTDOWN /s /t time` | [🔗](https://ss64.com/nt/shutdown.html) |
| SUBST | Associates a path with a drive letter. | `SUBST drive: path` | [🔗](https://ss64.com/nt/subst.html) |
| SYSTEMINFO | Displays detailed system information. | `SYSTEMINFO` | [🔗](https://ss64.com/nt/systeminfo.html) |
| TAKEOWN | Takes ownership of a file or folder. | `TAKEOWN /F file_or_folder` | [🔗](https://ss64.com/nt/takeown.html) |
| TASKKILL | Ends tasks or processes. | `TASKKILL /IM imagename` | [🔗](https://ss64.com/nt/taskkill.html) |
| TASKLIST | Displays a list of currently running tasks. | `TASKLIST` | [🔗](https://ss64.com/nt/tasklist.html) |
| TELNET | Communicates using the Telnet protocol. | `TELNET [host] [port]` | [🔗](https://ss64.com/nt/telnet.html) |
| TREE | Graphically displays folder structure. | `TREE path` | [🔗](https://ss64.com/nt/tree.html) |
| TSDISCON | Disconnects a Terminal Services session. | `TSDISCON sessionid` | [🔗](https://ss64.com/nt/tsdiscon.html) |
| WHERE | Locates and displays file paths matching a pattern. | `WHERE pattern` | [🔗](https://ss64.com/nt/where.html) |
| WHOAMI | Displays user, group, and privilege information. | `WHOAMI` | [🔗](https://ss64.com/nt/whoami.html) |

---

# References
- [Windows CMD Command Syntax - SS64.com](https://ss64.com/nt/syntax.html)
- [An A-Z Index of Windows CMD commands - SS64.com](https://ss64.com/nt/)
