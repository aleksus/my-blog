# MyBlog - Functional Guide

## 1. Application Purpose

The goal of the application is to help users manage their blogs

## 2. User Roles

#### Guest (Not Authenticated User)

- Can view blogs
- Can view details on blogs and comments
- Can register or login

#### Authenticated User

- Can create new blogs
- Can edit their own blogs
- Can delete their own blogs
- Can create comments
- Can delete their comments
- Can edit their account info
- Can change their password

## 3. Public Features
- Home page
- Posts page displaying all blogs with shortened text
- Post details page showing the full blog post and comments
- Login page
- Register page

## 4. Authenticated User Features

- Create new blogs
- Edit own blogs
- Delete own blogs
- Create new comments
- Delte own comments
- View own profile
- Edit own profile
- Change own password

## 5. Main Application Flow

1. User opens the Home page
2. User navigates to Posts
3. User selects a blog post to read and opens Details Page
4. User logs in or registers
5. Authenticated user creates, updates or deletes their blog posts
6. Authenticated user creates or deletes their blog post comments
7. Posts appear in the blog post lists
8. Comments appear in the comment section under each blog post
9. Authenticated user can update his information or change password
10. Images are shown as headers for each blog post if uploaded

## 6. Data Structure

Here is a breif description of the data collection used in the applicaton

##### Comment Object

- id
- content
- user
- post

##### Post Object

- id
- title
- content
- user
- imageUrl

##### User Object

- id
- name
- email
- password

## 7. Project Architecture

- core/
  - constants/
  - guards/
  - interceptors/
  - models/
  - services/
- features/
  - auth/
  - comment-section/
  - home/
  - not-found/
  - posts/
  - profile/
- layout/
  - footer/
  - header/
- shared/
  - components/
  - directives/
  - pipes/
  - validators/

## 8. Technologies Used

- Angular
- Typescript
- RxJS
- SpringBoot/REST API
- CSS

## 9. How to Run the Project

1. Clone the Angular frontend repository:
   `https://github.com/aleksus/my-blog.git`
2. Clone the SpringBoot backend repository:
   `https://github.com/aleksus/my-blog-backend.git`
3. Download and setup Apache Maven and Java JDK (*or run it using IntelliJ IDEA*)

4. Start the backend
   `mvn spring-boot:run`
5. Install frontend dependencies
   ``npm install` ``
6. Start the application
   `ng serve`
7. Open the application
   `http://localhost:4200`
