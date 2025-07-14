# Renaissance Entity Relationship Diagram (ERD)

## 🎯 Overview

This ERD represents the complete database structure for Renaissance, an AI-powered mind mapping tool designed to transform abstract ideas into actionable plans.

---

## 📊 Entity Relationship Diagram

```mermaid
erDiagram
    %% Core User Management
    USERS {
        int id PK
        string username UK "50 chars"
        string email UK "255 chars"
        string password_hash "nullable"
        string google_id UK "nullable"
        timestamp created_at
        timestamp updated_at
    }

    %% Subscription Management
    SUBSCRIPTION_PLANS {
        int id PK
        string plan_name UK
        decimal price "10,2"
        int duration_days "nullable"
        text description
    }

    USER_SUBSCRIPTIONS {
        int id PK
        int user_id FK "unique"
        int plan_id FK
        string status
        timestamp start_date
        timestamp end_date
        timestamp canceled_at
        string stripe_customer_id UK
        string stripe_subscription_id UK
    }

    %% Core Content Management
    GALAXIES {
        int id PK
        int user_id FK
        string name "100 chars"
        timestamp created_at
    }

    NOTES {
        int id PK
        int user_id FK
        int galaxy_id FK "nullable"
        string title "255 chars"
        text content "nullable"
        timestamp created_at
        timestamp updated_at
    }

    INSIGHTS {
        int id PK
        int note_id FK
        text content
        timestamp created_at
    }

    %% Task Management
    TASKS {
        int id PK
        int user_id FK
        string content
        boolean is_completed "default false"
        boolean is_ai_generated "default false"
        boolean is_favorite "default false"
        text goal "nullable"
        timestamp created_at
        timestamp updated_at
    }

    %% Communication System
    CONVERSATIONS {
        int id PK
        timestamp created_at
    }

    CONVERSATION_PARTICIPANTS {
        int conversation_id FK
        int user_id FK
        primary_key conversation_id, user_id
    }

    MESSAGES {
        int id PK
        int conversation_id FK
        int sender_id FK
        text content
        timestamp created_at
    }

    %% Relationships
    USERS ||--o{ GALAXIES : "creates"
    USERS ||--o{ NOTES : "creates"
    USERS ||--o{ TASKS : "creates"
    USERS ||--o{ USER_SUBSCRIPTIONS : "has"
    USERS ||--o{ CONVERSATION_PARTICIPANTS : "participates_in"
    USERS ||--o{ MESSAGES : "sends"

    GALAXIES ||--o{ NOTES : "contains"

    NOTES ||--o{ INSIGHTS : "generates"

    SUBSCRIPTION_PLANS ||--o{ USER_SUBSCRIPTIONS : "offers"

    CONVERSATIONS ||--o{ CONVERSATION_PARTICIPANTS : "has"
    CONVERSATIONS ||--o{ MESSAGES : "contains"
```

---

## 🏗️ Database Schema Details

### **Core Entities**

#### **1. USERS Table**

- **Purpose**: Store user account information and authentication data
- **Key Features**:
  - Supports both traditional and Google OAuth authentication
  - Unique constraints on username and email
  - Timestamp tracking for account management

#### **2. GALAXIES Table**

- **Purpose**: AI-generated clusters of related notes/ideas
- **Key Features**:
  - Weekly AI analysis groups related notes
  - User-specific galaxy organization
  - Visual representation on dashboard

#### **3. NOTES Table** (formerly IDEAS)

- **Purpose**: Rich-text notes created by users
- **Key Features**:
  - Optional galaxy assignment
  - Rich text content support
  - Integration with TenTap editor
  - Auto-save functionality

#### **4. INSIGHTS Table**

- **Purpose**: AI-generated insights for notes
- **Key Features**:
  - Maintains only 3 most recent insights per note
  - Automatic cleanup of older insights
  - Timestamp tracking for insight history

#### **5. TASKS Table**

- **Purpose**: Hybrid task management (user-created + AI-generated)
- **Key Features**:
  - Distinguishes between user and AI-generated tasks
  - Goal association for context
  - Favorite marking capability
  - Daily AI task generation

### **Communication System**

#### **6. CONVERSATIONS Table**

- **Purpose**: Group chat functionality (future feature)
- **Key Features**:
  - Supports multiple participants
  - Foundation for Creator Hub

#### **7. CONVERSATION_PARTICIPANTS Table**

- **Purpose**: Many-to-many relationship between users and conversations
- **Key Features**:
  - Composite primary key
  - Cascade deletion support

#### **8. MESSAGES Table**

- **Purpose**: Individual messages within conversations
- **Key Features**:
  - Real-time messaging support
  - Sender tracking
  - Timestamp for message history

### **Subscription Management**

#### **9. SUBSCRIPTION_PLANS Table**

- **Purpose**: Define available subscription tiers
- **Key Features**:
  - Flexible pricing structure
  - Plan duration tracking
  - Description for UI display

#### **10. USER_SUBSCRIPTIONS Table**

- **Purpose**: Track user subscription status
- **Key Features**:
  - Stripe integration support
  - Subscription lifecycle management
  - One subscription per user

---

## 🔄 Key Relationships & Business Logic

### **User-Centric Relationships**

1. **User → Galaxies**: One user can have multiple galaxies
2. **User → Notes**: One user can have multiple notes
3. **User → Tasks**: One user can have multiple tasks
4. **User → Subscriptions**: One user can have one active subscription

### **Content Organization**

1. **Galaxy → Notes**: One galaxy can contain multiple notes (optional relationship)
2. **Note → Insights**: One note can have multiple insights (limited to 3 most recent)

### **Communication Flow**

1. **Conversation → Participants**: Many-to-many relationship
2. **Conversation → Messages**: One conversation can have multiple messages
3. **User → Messages**: One user can send multiple messages

---

## 🎯 Business Rules & Constraints

### **Data Integrity Rules**

1. **User Authentication**: Users must have either password_hash or google_id
2. **Note Organization**: Notes can exist without galaxy assignment
3. **Insight Management**: Maximum 3 insights per note, automatic cleanup
4. **Task Generation**: Daily AI task generation at 12:00 AM
5. **Galaxy Generation**: Weekly AI galaxy clustering

### **Subscription Rules**

1. **One Active Subscription**: Users can have only one active subscription
2. **Plan Validation**: User subscriptions must reference valid plans
3. **Payment Integration**: Stripe customer and subscription ID tracking

### **Communication Rules**

1. **Participant Validation**: Message senders must be conversation participants
2. **Conversation Access**: Users can only access conversations they participate in

---

## 🚀 API Endpoints Mapping

### **Authentication Endpoints**

- `POST /api/auth/register` → USERS table
- `POST /api/auth/login` → USERS table
- `GET /api/auth/me` → USERS table

### **Note Management Endpoints**

- `POST /api/idea` → NOTES table (create)
- `POST /api/saveNote` → NOTES table (update)
- `GET /api/insights` → INSIGHTS table
- `GET /api/finalInsights` → INSIGHTS table

### **Task Management Endpoints**

- `GET /api/tasks` → TASKS table
- `POST /api/tasks` → TASKS table
- `PUT /api/tasks/:id` → TASKS table
- `DELETE /api/tasks/:id` → TASKS table

### **Galaxy Management**

- Dashboard displays → GALAXIES + NOTES tables
- Galaxy clustering → AI analysis of NOTES table

---

## 📈 Scalability Considerations

### **Performance Optimizations**

1. **Indexing Strategy**:

   - User ID indexes on all user-related tables
   - Created_at indexes for time-based queries
   - Galaxy_id index for note filtering

2. **Data Archiving**:
   - Old insights automatic cleanup
   - Completed task archiving strategy
   - Message history management

### **Future Enhancements**

1. **Creator Hub**: Leverages existing conversation system
2. **Advanced Analytics**: Builds on current data structure
3. **Collaboration Features**: Extends conversation capabilities

---

## 🔧 Implementation Notes

### **Migration Strategy**

1. **Ideas → Notes**: Complete table rename and relationship updates
2. **Insight Management**: Implement automatic cleanup triggers
3. **AI Integration**: Database hooks for AI task generation

### **Data Validation**

1. **Content Length**: Enforce character limits on titles and content
2. **User Input**: Sanitize all user-generated content
3. **Relationship Integrity**: Cascade delete rules for data consistency

---

_This ERD provides a complete foundation for implementing Renaissance's database architecture, supporting all current features and future enhancements outlined in the PRD._
