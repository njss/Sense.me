#GULP and Automatic Reload
https://community.nitrous.io/tutorials/setting-up-gulp-with-livereload-sass-and-other-tasks


#DOCKER
https://github.com/learncodeacademy/docker-static-nginx

#create image
docker build -t njssnjss/sense .

#list images 
docker images

#remove image
docker rmi njssnjss/sense

#run container
docker run -d -p 80:80 --name sense njssnjss/sense
#remove container
docker rm -force sense

#list containers
docker ps

#edit hosts file
sudo gedit /etc/hosts
127.0.0.1:8081 sense.me
sudo /etc/init.d/networking restart
sense.me (in browser)


#docker push to docker hub
docker login
docker push njssnjss/sense





