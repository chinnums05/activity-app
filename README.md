# Activity App

Node version required is 20 LTS. The front-end will break on 22.

* Clone the repo.
* Do `npm install` inside both server and client folders.
* The API requires database service. If you have docker installed, use the below `docker-compose.yaml` file

```
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: activity_social_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword      # Root password
      MYSQL_DATABASE: activity_social_db     # Database name
      MYSQL_USER: user                       # Regular user
      MYSQL_PASSWORD: password               # Regular user password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
  ```
  If you don't have docker, setup a mysql server yourself and update the `.env` file inside `server` folder.

* Start both services from each individual folders.
