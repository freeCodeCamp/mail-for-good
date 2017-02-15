FROM node:7-onbuild

COPY package.json .
RUN npm install

# Compile the frontend
COPY client .
RUN npm run build

# Add source files 
COPY . .

CMD ["npm", "start"]
EXPOSE 8080
