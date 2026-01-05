# Use the Cypress base image
FROM cypress/included:12.17.1

# Set the working directory
WORKDIR /e2e

# Copy project files into the container
COPY . .

# Install dependencies
RUN npm install

# Run Cypress tests
CMD ["npx", "cypress", "run"]
