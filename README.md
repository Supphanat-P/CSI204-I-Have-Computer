# I HAVE COMPUTER

---

# Table of Contents

- [1. ผู้มีส่วนร่วม (Contributors)](#1-ผู้มีส่วนร่วม-contributors)
- [2. หลักการและเหตุผล (Rationale)](#2-หลักการและเหตุผล-rationale)
- [3. วัตถุประสงค์ของโครงงาน (Objectives)](#3-วัตถุประสงค์ของโครงงาน-objectives)
- [4. ขอบเขตของระบบ (System Scope)](#4-ขอบเขตของระบบ-system-scope)
- [5. แนวทางของการพัฒนาตาม SDLC](#5-แนวทางของการพัฒนาตาม-sdlc)
- [6. Tech Stack](#6-tech-stack)
- [7. แนวทางการทดสอบ (Testing Approach)](#7-แนวทางการทดสอบ-testing-approach)
- [8. ผลลัพธ์ที่คาดว่าจะได้รับ (Expected Outcomes)](#8-ผลลัพธ์ที่คาดว่าจะได้รับ-expected-outcomes)
- [9. แผนการดำเนินงาน 4 สัปดาห์ (Work Plan)](#9-แผนการดำเนินงาน-4-สัปดาห์-work-plan)
- [10. Requirement](#10-requirement)
- [11. User Personas](#11-user-personas)
- [12. Use Case Diagram](#12-use-case-diagram)
- [13. Class Diagram](#13-class-diagram)
- [14. Sequence Diagrams](#14-sequence-diagrams)
- [15. Wireframe](#15-wireframe)
- [16. System Architecture](#16-system-architecture)

---

# 1. ผู้มีส่วนร่วม (Contributors)

| Name | Student ID | Role | GitHub |
|------|------------|------|--------|
| Name | 67162090   | Project Manager | @Supphanat-P |
| Name | 67178272 | Frontend Developer | @Chinnaphat-ppsadzy |
| Name | 67160778 | Backend Developer | @Theeradon-map |
| Name | 67081836 | UI/UX Designer | @Theepakorn-T |
| Name | XXXXXXXX | UI/UX Designer | @username |

---

# 2. หลักการและเหตุผล (Rationale)

- โครงงานนี้จัดทำขค้นเพื่อพัฒนาแพลตฟอร์ม e-Commerce จำหน่ายอุปกรณ์คอมพิวเตอร์ออนไลน์ที่ช่วยให้ผู้ซื้อสามารถ สืบค้น เปรียบเทียบเสปค และสั่งซื้อสินค้าได้ตลอด 24 ชั่วโมง
  โดยตัวระบบ มุ่งเน้นการบูรณการเทคโนโลยี React , Node.js และ Local Storage เพื่ออำนวยความสะดวกแก่ผู้ใช้งานในทุกสถานที่พร้อมทั้งมีระบบหลังบ้านที่ช่วยให้ผู้บริหารจัดการข้อมูลสินค้าและควบคุมคลังสต็อกได้อย่างถูกต้อง แม่นยำ และมีประสิทธิภาพ

---

# 3. วัตถุประสงค์ของโครงงาน (Objectives)

1. เพื่อศึกษาและประยุกต์ใช้กรอบแนวคิดดิจิตัลแพลตฟอร์ม เว็บแอปพลิเคชั่นเฟรมเวิร์ก และ้ครื่องมือสมัยใหม่ในการพัฒนา "ระบบร้านจำหน่ายอุปกรณ์คอมพิวเตอร์" ได้อย่างมีประสิทะฺภาพ

2. เพื่อออกแบบ ออกคำสั่งและพัฒนาระบบจัดการฟังก์ชันหลักของe-Commerce เช่น ระบบตะกร้าสินค้า ระบบค้นหา และระบบแบ่งสิทธิ์การใช้งานตามบทบาทผู้ใช้ ได้อย่างถูกต้อง

3. เพื่อศึกษาและฝึกฝนการทำงานร่วมกันเป็นทีม 

---

# 4. ขอบเขตของระบบ (System Scope)

- ล็อคอิน / สมัครสมาชิก
- การค้นหาสินค้า
- การดูรายละเอียดสินค้า
- การจัดการตะกร้าสินค้า
- ระบบสั่งซื้อสินค้า
- ระบบชำระเงิน
- ระบบจัดการข้อมูลสินค้า
- ดูประวัติการสั่งซื้อ

## User Roles

| Role |
|------|
| Admin | 
| Customers |
| Manager |

---

# 5. แนวทางของการพัฒนาตาม SDLC

## SDLC Model

### Phase 1 - Planning

- ประชุมวางแผนกำหนดขอบเขตระบบ แบ่งหน้าที่รับผิดชอบของสมาชิกทั้ง 5 คน และกำหนดกรอบเวลา

### Phase 2 - Analysis

- วิเคราะห์ความต้องการระบบ รวบรวมข้อมูลจำเพาะของอุปกรณ์คอมพิวเตอร์ และพฤติกรรมการซื้อของผู้ใช้

### Phase 3 - Design

- ออกแบบสถาปัตยกรรมข้อมูล โครงสร้างระบบแผนภาพ Flowchart ด้วย Draw.io และออกแบบหน้าจอติดต่อผู้ใช้ (UI/UX) ด้วย Figma

### Phase 4 - Development

- เขียนโปรแกรมฝั่ง Frontend ด้วย React และ Tailwind CSS เชื่อมต่อกับ Backend Node.js และจัดการข้อมูลผ่าน Local Storage

### Phase 5 - Testing

- ดำเนินการทดสอบระบบผ่านเครื่องมือ Postman ทำ Manual Testing และ UAT ตรวจสอบบั๊กและแก้ไขลอจิกให้ถูกต้องตามเงื่อนไข

### Phase 6 - Deployment

- จัดเตรียมโครงสร้างแพลตฟอร์มเพื่อส่งมอบโครงงานบูรณาการระบบหน้าบ้านและหลีงบ้าน ให้ทำงานร่วมกันอย่างสมบูรณ์

### Phase 7 - Maintenance

- สรุปผลการพัฒนา ตรวจสอบเสถียรภาพของการจัดเก็บข้อมูล ใน Local Storage และจัดทำเอกสารประกอบรายงาน

---

# 6. Tech Stack

## Frontend

- REACT VITE
- TAILSWIND CSS
- Library etc.

## Backend

- Node js
- etc.

## Database

- Local Storage

## DevOps

- GitHub Actions

## Tools

- Figma
- Postman
- VS Code
- Git Desktop
- Manual Testing

---

# 7. แนวทางการทดสอบ (Testing Approach)

## Testing Types

- Functional Testing
- API Testing
- User Acceptance Testing (UAT)

## Test Cases

| Feature | Test Case | Expected Result | Status |
|----------|-----------|----------------|--------|
| Login | | | |
| Register | | | |
| CRUD | | | |

---

# 8. ผลลัพธ์ที่คาดว่าจะได้รับ (Expected Outcomes)

- ผลลัพธ์ที่ 1
- ผลลัพธ์ที่ 2
- ผลลัพธ์ที่ 3
- ผลลัพธ์ที่ 4

---

# 9. แผนการดำเนินงาน 4 สัปดาห์ (Work Plan)

| Week | Tasks | Status |
|------|-------|--------|
| Week 1 | วิเคราะห์ความต้องการ | ⬜ |
| Week 2 | ออกแบบระบบ | ⬜ |
| Week 3 | พัฒนาระบบ | ⬜ |
| Week 4 | ทดสอบและส่งมอบ | ⬜ |

หรือใช้ Gantt Chart

```text
Week 1 ████████
Week 2 ████████
Week 3 ████████
Week 4 ████████
```

---

# 10. Requirement

## Functional Requirements

- FR-001
- FR-002
- FR-003

## Non-functional Requirements

- Performance
- Security
- Reliability
- Scalability
- Availability

---

# 11. User Personas

## Persona 1

**Name:** User Name

**Age:** XX

**Occupation:** XXXX

**Goals**

- Goal 1
- Goal 2

**Pain Points**

- Pain 1
- Pain 2

![Persona](./images/persona1.png)

---

## Persona 2

รายละเอียด...

![Persona](./images/persona2.png)

---

# 12. Use Case Diagram

## Diagram

![Use Case](./images/usecase.png)

## Description

อธิบายภาพรวมของ Use Case

---

# 13. Class Diagram

## Diagram

![Class Diagram](./images/class-diagram.png)

## Description

อธิบายความสัมพันธ์ของคลาส

---

# 14. Sequence Diagrams

## Login

![Login Sequence](./images/login-sequence.png)

---

## Register

![Register Sequence](./images/register-sequence.png)

---

## CRUD

![CRUD Sequence](./images/crud-sequence.png)

---

# 15. Wireframe

## Home

![Home](./images/home-wireframe.png)

---

## Dashboard

![Dashboard](./images/dashboard-wireframe.png)

---

## Mobile

![Mobile](./images/mobile-wireframe.png)

---

# 16. System Architecture

## Architecture Diagram

![Architecture](./images/architecture.png)

## Description

อธิบายโครงสร้างระบบ เช่น

- Client
- API
- Backend
- Database
- External Services

---

# 📂 Project Structure

```
project-name/
│
├── frontend/
├── backend/
├── database/
├── docs/
├── images/
├── README.md
└── LICENSE
```

---
