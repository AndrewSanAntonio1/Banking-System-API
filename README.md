# Banking-System-API

A secure, enterprise-style Banking System built with **Spring Boot** following clean architecture and RESTful API best practices. The project demonstrates secure authentication, banking transactions, audit logging, concurrency handling, and scalable backend design.

## Features

### Authentication & Security

* User Registration
* User Login
* JWT Authentication
* Role-Based Access Control (ADMIN, USER)
* Password Encryption (BCrypt)
* Protected REST APIs
* Input Validation
* Global Exception Handling

### Account Management

* Create Bank Account
* View Account Details
* Update Account Information
* Close Account
* Account Status Management

### Banking Transactions

* Deposit Funds
* Withdraw Funds
* Transfer Funds
* Transaction History
* Daily Transfer Limit
* Account Balance Validation
* Transaction Receipts

### Admin Features

* Customer Management
* Account Management
* Transaction Monitoring
* Audit Logs
* Fraud Detection Dashboard
* Reports & Analytics

### Audit & Monitoring

* User Activity Logs
* Login History
* Transaction Logs
* Account Change Logs
* Security Event Logging

## Tech Stack

### Backend

* Java 17
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* JWT Authentication
* Bean Validation
* Lombok

### Database

* MySQL

### Documentation

* Swagger / OpenAPI

### Testing

* JUnit 5
* Spring Boot Test

### Build Tool

* Gradle

## Project Architecture

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Additional Layers

* DTO
* Entity
* Mapper
* Security
* Exception Handling
* Validation
* Configuration
* Utility Classes

## Business Rules

* Users can only access their own accounts.
* Only administrators can manage customers and accounts.
* Transfers require sufficient account balance.
* Daily transfer limits are enforced.
* Every transaction is recorded for auditing.
* Invalid requests return standardized error responses.

## Technical Challenges Solved

* Secure JWT authentication and authorization.
* Password hashing with BCrypt.
* Transaction consistency using ACID principles.
* Concurrent transaction handling with optimistic/pessimistic locking.
* Global exception handling for consistent API responses.
* Input validation using Jakarta Validation.
* Clean separation of concerns using layered architecture.
* Audit logging for user and banking activities.
* Role-based API security.
* RESTful API design following enterprise best practices.

## API Modules

* Authentication
* Users
* Accounts
* Transactions
* Transfers
* Audit Logs
* Fraud Detection
* Reports

## Future Improvements

* Refresh Tokens
* Redis Caching
* Email Notifications
* Docker Support
* Kafka Event Streaming
* RabbitMQ Messaging
* Microservices Architecture
* Prometheus & Grafana Monitoring
* CI/CD Pipeline
* Cloud Deployment (AWS)

## Goals

This project is designed to simulate a real-world banking backend while applying enterprise software engineering practices, including secure authentication, transactional integrity, scalable architecture, and maintainable code organization.
