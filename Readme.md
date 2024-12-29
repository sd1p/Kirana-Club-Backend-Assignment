# Description

Job processing service that takes jobs in the form of POST requests and enqueues them in a persistent Redis queue.
The jobs are then processed by a worker that processes images store by store, calculates the perimeter of the images, and generates an aggregated image processing error report (if any) for each store in the job.

## Assumptions

- Error aggrigation condition in worker.js
    1. If StoreID is invalid
    2. If image_url length is 0
    3. If image_url is invalid
    4. If invalid MIME type off url
    5. If failed to fetch image from url
    6. If failed to calculate image dimensions

## Installation and Setup

### For local setup

1. Clone the repository

   ```sh
    git clone https://github.com/sd1p/Kirana-Club-Backend-Assignment
   ```

2. Install dependencies

   ```sh
    npm install
   ```

3. Copy .env.example to .env

   ```sh
    cp .env.example .env
   ```

   - add DATABASE_URL (provided in email)

4. Generate prisma client

   ```sh
    npx prisma generate
   ```

5. Start Redis server

   ```sh
    docker run --name redis -p 6379:6379 -d redis
   ```

6. Run the server and worker

   ```sh
    npm run start:all
   ```

6. The server will be running on <http://localhost:3000>

### For Docker-Compose setup

1. Clone the repository

   ```sh
    git clone https://github.com/sd1p/Kirana-Club-Backend-Assignment
   ```

2. Add DATABASE_URL in docker-compose.yml

   ```yml
   environment:
      DATABASE_URL: "postgres://username:password@host:port/dbname"
   ```

3. Run the server and worker

   ```sh
    docker-compose up
   ```

4. To stop the server and worker

   ```sh
    docker-compose down
   ```

5. The server will be running on <http://localhost:3000>

## API Endpoints

1. POST `http://localhost:3000/api/submit`

   - Request Body

     ```json
        {
        "count":2,
        "visits":[
            {
                "store_id":"RP00001",
                "image_url":[
                    "https://www.gstatic.com/webp/gallery/2.jpg",
                    "https://www.gstatic.com/webp/gallery/3.jpg"
                ],
                "visit_time": "2024-12-28T22:28:08Z"
            },
            {
                "store_id":"RP00002",
                "image_url":[
                    "https://www.gstatic.com/webp/gallery/3.jpg"
                ],
                "visit_time": "2024-12-28T22:28:08Z"
            }
        ]
        }

        ```

     - Response (201 Created)

        ```json

        {
            "jobid": 20
        }
        ```

2. GET `http://localhost:3000/api/status?jobid=19`

   - Response (200 OK)

     ```json
        {
        "jobId": 20,
        "status": "COMPLETED"
        }

     ```

## Brief description of the work environment used to run this project (Computer/operating system, text editor/IDE, libraries, etc)

- Computer/Operating System: Windows 11
- Text Editor/IDE: Visual Studio Code
- Libraries: Node.js, Express.js, Prisma ORM, Redis, BullMQ (for Pub/SUB), Axios, Sharp, Zod, Docker, Docker-Compose, PostgreSQL (Supabase Free Tier), Concurrently (for running server and worker concurrently), csv-parser (for parsing CSV and seeding DB)

## If given more time, what improvements will you do?

- I would have implemented the service in golang, currently I am not proficient in golang but I am learning it.

- I would have implemented a better error handling mechanism in the worker.js file.

## DB Schema

```prisma
    model Store {
    storeId   String @id @unique
    storeName String
    areaCode  String
    }

    model Job {
    jobId     Int       @id @default(autoincrement())
    count     Int
    status    JobStatus @default(PROCESSING)
    visits    Json[]
    createdAt DateTime  @default(now())
    updatedAt DateTime  @updatedAt
    error     JobError?
    }

    model JobError {
    id      Int    @id @default(autoincrement())
    message String
    jobId   Int    @unique
    job     Job    @relation(fields: [jobId], references: [jobId])
    }

    enum JobStatus {
    PROCESSING
    COMPLETED
    FAILED
    }
```
