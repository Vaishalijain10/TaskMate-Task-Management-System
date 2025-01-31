





// Task Manager Application 

// website name - "TaskMate"
// website tagline - "TaskMate – Motivate, Collaborate, and Create!"

// website colour theme - professional - blue, grey, green, red, black

// styling - tailwind css 

// frontend - React + Vite + tailwind Css
1. Login, registration and forgot password -> jwt authentication
2. error page -
    @navbar -> profile view -> registration details will display and access to edit details 
3. home page - list of task in table with filer options, side button to add new task
    @Add sorting (by date, status, title).
    @table colums - edit/delete button column, task number, title, description, status (drop down - completed, pending), timeStamp
    @Implement pagination for large datasets. 
    @Consider adding drag-and-drop for task reordering.
    @footer - @copyright 
4. window components -  edit form and delete - alert/ toast to confirm 
5. logout 

// backend - Node and express 
    @password - hashing bcrypt , @nodemailer - otp , sms - ? , @cloudinary  
1. registration fields -> firstName, lastName, phoneNumber, EmailId, tempOtp, password, confirmPassword, ProfilePhoto, timeStamp, 
2. task field -> Task id, title, description, status (drop down), timeStamp


// database 
1. mongoDB 





Sign up/Login (JWT-based authentication).
Create, Read, Update, and Delete (CRUD) tasks.
Mark tasks as completed or pending.
View tasks in a list format with filtering options.



npm - package install 
pnpm - new files install 