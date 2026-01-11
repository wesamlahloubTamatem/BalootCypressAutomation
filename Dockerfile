# Use the Cypress base image
FROM cypress/included:12.0.0

# Set the working directory
WORKDIR /e2e

# Copy package.json and package-lock.json files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the project files into the container
COPY . .

# Run tests
CMD ["bash", "-lc", "npm run cypress:run"]
