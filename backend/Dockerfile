# Step 1: Base image
FROM openjdk:17-jdk-slim

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy Spring Boot jar
COPY target/Multi-Language-Romanized-Text-Converter-0.0.1-SNAPSHOT.jar app.jar

# Step 4: Install Python and system packages
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip tesseract-ocr poppler-utils && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Step 5: Create a virtual environment inside the container
RUN python3 -m venv /app/textconverter_env

# Step 6: Copy Python modules and install requirements into venv
COPY pythonModules /app/pythonModules
RUN /app/textconverter_env/bin/pip install --no-cache-dir -r /app/pythonModules/requirements.txt

# Step 7: Set environment variables so Spring Boot knows paths
ENV PYTHON_EXEC=/app/textconverter_env/bin/python3
ENV TRANSLATOR_SCRIPT=/app/pythonModules/translator_cli.py

# Step 8: Expose backend port
EXPOSE 8080

# Step 9: Run Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]