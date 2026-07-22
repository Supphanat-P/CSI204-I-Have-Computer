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
- [14. Data Schema](#14-data-schema)
- [15. Sequence Diagrams](#15-sequence-diagrams)
- [16. Wireframe](#16-wireframe)

---

# 1. ผู้มีส่วนร่วม (Contributors)

| Name | Student ID | Role | GitHub |
|------|------------|------|--------|
| Name | 67162090   | Project Manager | @Supphanat-P |
| Name | 67081836 | Frontend Developer | @Theepakorn-T |
| Name | 67160778 | Frontend Developer  | @Theeradon-map |
| Name | 67178272 | UI/UX Designer | @Chinnaphat-ppsadzy |
| Name | 67158596 | UI/UX Designer | @Peeraphong-Taz |

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

---

# 8. ผลลัพธ์ที่คาดว่าจะได้รับ (Expected Outcomes)

1. ได้เว็บแอปพลิเคชันระบบร้านจำหน่ายอุปกรณ์คอมพิวเตอร์ ที่ฟังก์ชันการทำงานตรงตามขอบเขต และ เสถียรภาพสูง

2. เข้าใจกระบวนการทำและเลือกใช้เทคโนโลยีเว็บแอปพลิเคชัน (React, Node.js, Local Storage) ตลอดจนการจัดการสิทธิ์ User Roles

3. สมาชิกในกลุ่มเข้าใจกระบวนการทำงานร่วมกัน ผ่าน GitHub และการพัฒนาซอฟต์แวร์อย่างเป็นระบบตามหลัก SDLC ทั้ง 7 ขั้นตอน

4. มีเอกสารสรุปผลการทดสอบระบบ (Test Report) จาก Postman และ Manual Testing ที่สามารถนำไปใช้เป็นประวัติการพัฒนาซอฟต์แวร์ได้

---

# 9. แผนการดำเนินงาน 4 สัปดาห์ (Work Plan)

| Week | Tasks | Status |
|------|-------|--------|
| Week 1 | วิเคราะห์และออกแบบระบบ | ประชุมกลุ่มสรุปฟังก์ชันที่ต้องการ, วาด Flowchart ระบบด้วย Draw.io และออกแบบ Wireframe/UI Prototype ทุกหน้าด้วย Figma |
| Week 2 | พัฒนา Frontend | ขึ้นฟอร์ม โครงสร้างโปรเจกต์ เขียนโค้ดหน้าจอผู้ใช้ด้วย React และจัดหน้าตาด้วย Tailwind CSS ให้รองรับระบบค้นหาและระบบตะกร้า |
| Week 3 | พัฒนา Backend และ ฐานข้อมูล | เขียนระบบประมวลผลฝั่งหลังบ้านด้วย Node.js พัฒนา RESTful API และเขียนเงื่อนไขการเรียกใช้ข้อมูลแบบ Client-Side ผ่าน Local Storage |
| Week 4 | ทดสอบและนำเสนอผลงาน | ทำ API Testing ด้วย Postman ทำการทดสอบ Functional & UAT ด้วย Manual Testing ตรวจสอบความถูกต้อง เก็บตกบั๊ก และจัดเตรียมสไลด์นำเสนอโครงการ |

---

# 10. Requirement

## Functional Requirements

- Cart
- Login / Register
- Products Brownser

## Non-functional Requirements

- Performance
- Security
- Reliability
- Scalability
- Availability

---

# 11. User Personas

## 1. ลูกค้า (Customer)

### นายกิตติภพ (นนท์) | อายุ 21 ปี
> *"ผมต้องการเว็บบอร์ดหรือหน้าร้านออนไลน์ที่บอกสเปคคอมอย่างละเอียด ชำระเงินง่าย ไม่ซับซ้อน"*

*   **อาชีพ:** นักศึกษาคณะเทคโนโลยีสารสนเทศ และเป็นเกมเมอร์
*   **บริบทและพฤติกรรม:** นนท์ชอบประกอบคอมพิวเตอร์และอัปเกรดอุปกรณ์อยู่เสมอ เขามักจะค้นหาข้อมูลสเปคคอมพิวเตอร์เชิงลึกก่อนตัดสินใจซื้อ และชอบความสะดวกรวดเร็วในการสั่งซื้อผ่านเว็บไซต์เพราะไม่มีเวลาไปเดินเลือกที่หน้าร้าน
*   **เป้าหมายในการใช้ระบบ (Goals):**
    *   ต้องการค้นหาและเปรียบเทียบสเปคอุปกรณ์คอมพิวเตอร์ (เช่น CPU, การ์ดจอ, RAM) ได้อย่างละเอียดและถูกต้อง
    *   อยากได้ระบบตะกร้าสินค้าที่ใช้งานง่าย สามารถเลือกสินค้าไว้ก่อนแล้วค่อยกดชำระเงินทีเดียวได้
    *   ต้องการดูประวัติการสั่งซื้อย้อนหลังเพื่อเช็ครายการสินค้าที่เคยซื้อไป
*   **จุดเจ็บปวด (Pain Points):**
    *   เว็บไซต์ทั่วไปมักแสดงรายละเอียดสินค้าไม่ครบถ้วน ทำให้ตัดสินใจยาก
    *   ขั้นตอนการสั่งซื้อและชำระเงินที่ซับซ้อนเกินไปอาจทำให้ล้มเลิกความตั้งใจในการซื้อ

---

## 2. ผู้ดูแลระบบ (Administrator)

### นายอภิสิทธิ์ (เก่ง) | อายุ 28 ปี
> *"ระบบหลังบ้านต้องอัปเดตง่าย ล็อกอินปลอดภัย และไม่ทำให้ข้อมูลสินค้าผิดพลาด"*

*   **อาชีพ:** เจ้าหน้าที่ไอทีและผู้ดูแลระบบ (IT Support & Admin)
*   **บริบทและพฤติกรรม:** เก่งมีความเชี่ยวชาญด้านคอมพิวเตอร์และระบบหลังบ้าน หน้าที่หลักของเขาคือการดูแลความเรียบร้อยของเว็บไซต์ และคอยอัปเดตข้อมูลสินค้าทุกครั้งที่มีโมเดลใหม่ ๆ หรืออุปกรณ์ไอทีล็อตใหม่เข้ามาในคลัง
*   **เป้าหมายในการใช้ระบบ (Goals):**
    *   ต้องการระบบจัดการข้อมูลสินค้า (เพิ่ม, ลบ, แก้ไข) ที่เสถียรและทำงานได้รวดเร็ว เพื่อให้ข้อมูลหน้าเว็บอัปเดตเป็นปัจจุบันที่สุด
    *   ต้องการจัดการสิทธิ์และเข้าถึงส่วนควบคุมระบบหลังบ้านได้อย่างปลอดภัย
*   **จุดเจ็บปวด (Pain Points):**
    *   ฟอร์มกรอกข้อมูลสินค้าหลังบ้านที่ใช้งานยาก หรือไม่มีการจัดหมวดหมู่ที่ดี ทำให้ใช้เวลาในการอัปเดตสต็อกนาน
    *   หากระบบการจัดการข้อมูล (ผ่าน Local Storage) ทำงานผิดพลาด อาจทำให้ราคาหรือรายละเอียดสินค้าหน้าเว็บแสดงผลไม่ตรงกับความเป็นจริง

---

## 3. ผู้จัดการ (Manager)

### คุณสมศักดิ์ | อายุ 45 ปี
> *"ผมต้องการเห็นภาพรวมของยอดขายและประวัติการสั่งซื้อเพื่อนำไปวางแผนสต็อกสินค้า"*

*   **อาชีพ:** เจ้าของร้านและผู้จัดการร้าน "I have Computer"
*   **บริบทและพฤติกรรม:** คุณสมศักดิ์เป็นผู้บริหารที่เน้นดูภาพรวมของธุรกิจ เขาไม่ได้ลงรายละเอียดเรื่องการโค้ดหรือการกรอกข้อมูลสินค้าด้วยตัวเอง แต่สนใจเรื่องยอดขาย รายการคำสั่งซื้อ และพฤติกรรมการซื้อของลูกค้าเพื่อนำไปวางแผนธุรกิจและสั่งของมาเติมในโกดัง
*   **เป้าหมายในการใช้ระบบ (Goals):**
    *   ต้องการเข้าดูประวัติการสั่งซื้อทั้งหมดของลูกค้าในระบบเพื่อตรวจสอบสถานะการชำระเงินและยอดขาย
    *   ต้องการระบบที่ช่วยควบคุมและตรวจสอบการทำงานของแอดมินในการจัดการสินค้าได้
*   **จุดเจ็บปวด (Pain Points):**
    *   การไม่สามารถตรวจสอบประวัติคำสั่งซื้อที่ชัดเจนได้ ทำให้ยากต่อการตรวจสอบบัญชีและสรุปยอดขายประจำเดือน
    *   ระบบที่ไม่มีการแยกสิทธิ์ (Roles) ที่ชัดเจน อาจทำให้พนักงานทั่วไปเข้าถึงข้อมูลสำคัญทางธุรกิจได้

---

# 12. Use Case Diagram

## Diagram

<img width="598" height="625" alt="userUsecase" src="https://github.com/user-attachments/assets/f1ef43ef-ddc6-4d91-ae3b-ae0432678595" />
<img width="450" height="461" alt="managerUsecase" src="https://github.com/user-attachments/assets/7d049471-2986-4d32-8bc2-8f522b9ba878" />
<img width="404" height="383" alt="adminUsecase" src="https://github.com/user-attachments/assets/15271798-1bf2-4d11-896b-c4561fa80d0c" />

---

# 13. Class Diagram

## Diagram

<img width="689" height="657" alt="classDiagram" src="https://github.com/user-attachments/assets/4f603698-5c1f-4fa2-8fd9-4ea00214352f" />

---

# 14. Data Schema

## Data Storage

- Backend source of truth: `backend/data/users.json`, `backend/data/products.json`, and `backend/data/orders.json`
- Frontend session and user-specific state are also mirrored in `localStorage` for cart, favorites, shipping addresses, payment methods, and cached orders

## Entities

### User

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | string | Yes | Unique user identifier |
| `name` | string | Yes | Full name |
| `email` | string | Yes | Used for login and must be unique |
| `password` | string | Yes | Stored as a bcrypt hash |
| `phone` | string | No | Default value is `-` or empty |
| `birthDate` | string | No | Optional profile field |
| `role` | string | Yes | `user`, `manager`, or `admin` |

### Product

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | number | Yes | Unique product identifier |
| `name` | string | Yes | Product name |
| `brand` | string | Yes | Product brand |
| `price` | number | Yes | Product price |
| `stock` | number | Yes | Available inventory |
| `image` | string | No | Image URL |
| `description` | string | No | Short product description |
| `type` / `productType` | string | No | Product category label used by the UI |
| `category` | string | No | More specific category grouping |
| `highlights` | string[] | No | Key selling points |
| `attributes` | object | No | Compact spec summary for cards and filters |
| `attributesDetails` | object | No | Full technical specification block |

### Order

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | string | Yes | Example: `IHC-58188` |
| `date` | string | Yes | ISO date format (`YYYY-MM-DD`) |
| `items` | array | Yes | List of `Order Item` objects |
| `total` | number | Yes | Grand total |
| `status` | string | Yes | Example: `รอดำเนินการ`, `จัดส่งแล้ว`, `เสร็จสิ้น`, `รอชำระเงิน` |
| `shippingAddress` | string | Yes | Delivery address |
| `recipientName` | string | Yes | Receiver name |
| `recipientPhone` | string | Yes | Receiver phone number |
| `paymentMethod` | string | Yes | Selected payment method |
| `userId` | string | Yes | Links the order to a user |

### Order Item

| Field | Type | Required | Notes |
|---|---|---:|---|
| `id` | number | Yes | Product ID reference |
| `name` | string | Yes | Snapshot of product name at purchase time |
| `brand` | string | Yes | Snapshot of product brand |
| `price` | number | Yes | Snapshot of unit price |
| `quantity` | number | Yes | Quantity purchased |
| `image` | string | No | Snapshot of product image |

## Relationships

- One `User` can have many `Order` records.
- One `Order` contains many `Order Item` records.
- One `Product` can appear in many `Order Item` records.
- Creating an order reduces product `stock` in `products.json`.

---

# 15. Sequence Diagrams

## Sequence Diagrams
## User Sequence Diagrams
<img width="317" height="632" alt="userSe" src="https://github.com/user-attachments/assets/a257c78c-c130-498d-8bdf-311669483b01" />

## User Sequence Diagrams
<img width="259" height="761" alt="managerSe" src="https://github.com/user-attachments/assets/04d03b72-395f-4b16-9879-f682b1b35ee4" />

## User Sequence Diagrams
<img width="697" height="458" alt="adminSe" src="https://github.com/user-attachments/assets/e1d59cc6-690a-46d8-88f3-35687e7be3ef" />

---

# 16. Wireframe

## Wireframe

Home
<img width="1920" height="1080" alt="1 Home" src="https://github.com/user-attachments/assets/543be1fa-ca68-48e0-8a9c-2eacda6c4ddc" />
Browser
<img width="1920" height="1080" alt="2 Browser" src="https://github.com/user-attachments/assets/74274f02-86a8-4597-8d09-34842a6691ee" />
Product
<img width="1920" height="1080" alt="3 Product" src="https://github.com/user-attachments/assets/ebd20da7-ef2a-48a7-a1cd-e422b92ddb7a" />
Cart 
<img width="1920" height="1080" alt="4 Carts" src="https://github.com/user-attachments/assets/8d13c276-5c77-4216-a87b-0ec814e761a5" />
Profile
<img width="1920" height="1080" alt="5 Profile" src="https://github.com/user-attachments/assets/17848815-3243-4d1b-9049-0c5c51554d72" />

---
