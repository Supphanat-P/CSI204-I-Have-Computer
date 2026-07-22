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
- [17. Prototypr](#17-prototype)
- [18. System Architecture](#18-system-architecture)

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

## User Diagram
<img width="598" height="625" alt="userUsecase" src="https://github.com/user-attachments/assets/f1ef43ef-ddc6-4d91-ae3b-ae0432678595" />

## Manager Diagram
<img width="450" height="461" alt="managerUsecase" src="https://github.com/user-attachments/assets/7d049471-2986-4d32-8bc2-8f522b9ba878" />

## Admin Diagram
<img width="404" height="383" alt="adminUsecase" src="https://github.com/user-attachments/assets/15271798-1bf2-4d11-896b-c4561fa80d0c" />

---

# 13. Class Diagram

<!-- ## Diagram Image
<img width="689" height="657" alt="classDiagram" src="https://github.com/user-attachments/assets/4f603698-5c1f-4fa2-8fd9-4ea00214352f" /> -->

```mermaid
classDiagram
    class User {
        +string id
        +string name
        +string email
        +string password
        +string phone
        +string birthDate
        +string role
        +register(userData) User
        +login(email, password) Token
        +updateProfile(profileData) boolean
        +changeRole(newRole) boolean
    }

    class Customer {
        +Array~Address~ addresses
        +Array~OrderItem~ cart
        +addToCart(product, quantity) void
        +removeFromCart(productId) void
        +checkout(orderDetails) Order
        +viewOrderHistory() Array~Order~
    }

    class Manager {
        +getAllOrders() Array~Order~
        +updateOrderStatus(orderId, status) boolean
        +createProduct(productData) Product
        +updateProduct(productId, productData) boolean
        +deleteProduct(productId) boolean
    }

    class Admin {
        +createProduct(productData) Product
        +updateProduct(productId, productData) boolean
        +deleteProduct(productId) boolean
        +manageUserRole(userId, newRole) boolean
        +viewSalesReport() Object
    }

    class Product {
        +number id
        +string name
        +string brand
        +number price
        +number stock
        +string image
        +string description
        +string category
        +Array~string~ highlights
        +Object attributes
        +Object attributesDetails
        +checkStock(quantity) boolean
        +deductStock(quantity) boolean
        +updateInfo(data) void
    }

    class Order {
        +string id
        +string date
        +Array~OrderItem~ items
        +number total
        +string status
        +string shippingAddress
        +string recipientName
        +string recipientPhone
        +string paymentMethod
        +string userId
        +calculateTotal() number
        +updateStatus(newStatus) void
        +getSummary() Object
    }

    class OrderItem {
        +number id
        +string name
        +string brand
        +number price
        +number quantity
        +string image
        +getSubtotal() number
    }

    class Cart {
        +Array~CartItem~ items
        +addItem(product, qty) void
        +removeItem(productId) void
        +updateQuantity(productId, qty) void
        +clearCart() void
        +getTotalPrice() number
    }

    class CartItem {
        +number productId
        +string name
        +number price
        +number quantity
        +string image
        +calculateSubtotal() number
    }

    User <|-- Customer
    User <|-- Manager
    User <|-- Admin

    Customer "1" -- "0..*" Order : places >
    Customer "1" -- "1" Cart : owns >
    Order "1" *-- "1..*" OrderItem : contains >
    Cart "1" *-- "0..*" CartItem : contains >
    OrderItem "0..*" -- "1" Product : references >
```

### Entity Functions & Methods Detail

1. **User & Role Entities (`User`, `Customer`, `Manager`, `Admin`)**
   - `register(userData)`: ตรวจสอบอีเมลซ้ำ เข้ารหัสรหัสผ่านด้วย bcrypt และบันทึกข้อมูลผู้ใช้ใหม่
   - `login(email, password)`: ตรวจสอบข้อมูลประจำตัวและออก JWT Access Token สำหรับเข้าสู่ระบบ
   - `updateProfile(profileData)`: อัปเดตข้อมูลส่วนตัว เช่น ชื่อ เบอร์โทรศัพท์ วันเดือนปีเกิด
   - `addToCart(product, quantity)`: เพิ่มสินค้าเข้าตะกร้าสินค้า
   - `checkout(orderDetails)`: สร้างคำสั่งซื้อใหม่และตัดสต็อกสินค้าในระบบ
   - `updateOrderStatus(orderId, status)` *(Manager)*: ปรับเปลี่ยนสถานะคำสั่งซื้อ (เช่น รอดำเนินการ, จัดส่งแล้ว, เสร็จสิ้น)
   - `createProduct / updateProduct / deleteProduct` *(Admin)*: เพิ่ม แก้ไข และลบข้อมูลสินค้าในคลัง

2. **Product Entity (`Product`)**
   - `checkStock(quantity)`: ตรวจสอบจำนวนสินค้าคงเหลือในคลังว่าเพียงพอหรือไม่
   - `deductStock(quantity)`: ตัดจำนวนสต็อกสินค้าเมื่อคำสั่งซื้อสำเร็จ
   - `updateInfo(data)`: อัปเดตข้อมูลและรายละเอียดสเปคคอมพิวเตอร์

3. **Order & OrderItem Entities (`Order`, `OrderItem`)**
   - `calculateTotal()`: คำนวณราคารวมทั้งหมดของคำสั่งซื้อ
   - `updateStatus(newStatus)`: เปลี่ยนสถานะคำสั่งซื้อ
   - `getSubtotal()` *(OrderItem)*: คำนวณราคารวมย่อยของรายการสินค้าแต่ละรายการ (`price * quantity`)

4. **Cart & CartItem Entities (`Cart`, `CartItem`)**
   - `addItem(product, qty)` / `removeItem(productId)`: เพิ่มหรือลบรายการสินค้าในตะกร้า
   - `updateQuantity(productId, qty)`: ปรับเปลี่ยนจำนวนสินค้าในตะกร้า
   - `getTotalPrice()`: คำนวณราคารวมทั้งหมดของสินค้าที่อยู่ในตะกร้า

---

# 14. Data Schema

## Data Storage
- **Backend Source of Truth**: `backend/data/users.json`, `backend/data/products.json`, และ `backend/data/orders.json`
- **Frontend Session & Storage**: `localStorage` (ตะกร้าสินค้า `cart`, เซสชันผู้ใช้ `user`, สินค้าโปรด `favorites`, ที่อยู่จัดส่ง และแคชการตั้งค่า)

## Entities & Tables

### 1. User (`users.json`)

| Field | Type | Required | Key / Constraints | Description |
|---|---|:---:|---|---|
| `id` | `string` | Yes | Primary Key (UUID/String) | รหัสอ้างอิงผู้ใช้งาน (ต้องไม่ซ้ำกัน) |
| `name` | `string` | Yes | - | ชื่อ-นามสกุลของผู้ใช้งาน |
| `email` | `string` | Yes | Unique | อีเมลสำหรับใช้เข้าสู่ระบบ |
| `password` | `string` | Yes | Hashed (bcrypt) | รหัสผ่านที่ผ่านการเข้ารหัสแล้ว |
| `phone` | `string` | No | Default: `"-"` | เบอร์โทรศัพท์ติดต่อ |
| `birthDate` | `string` | No | Format: `YYYY-MM-DD` | วันเดือนปีเกิด |
| `role` | `string` | Yes | Enum: `user`, `manager`, `admin` | สิทธิ์และบทบาทการใช้งานในระบบ |

### 2. Product (`products.json`)

| Field | Type | Required | Key / Constraints | Description |
|---|---|:---:|---|---|
| `id` | `number` | Yes | Primary Key (Unique Int) | รหัสสินค้า |
| `name` | `string` | Yes | - | ชื่อสินค้า |
| `brand` | `string` | Yes | - | แบรนด์สินค้า |
| `price` | `number` | Yes | `min: 0` | ราคาจำหน่าย (บาท) |
| `stock` | `number` | Yes | `min: 0` | จำนวนสินค้าคงเหลือในสต็อก |
| `image` | `string` | No | URL / Path | พาธหรือ URL รูปภาพสินค้า |
| `description` | `string` | No | - | คำอธิบายรายละเอียดสินค้าแบบย่อ |
| `type` / `productType` | `string` | Yes | Category Label | ประเภทสินค้า (เช่น `CPU`, `GPU`, `RAM`) |
| `category` | `string` | No | Sub-category | หมวดหมู่ย่อยของสินค้า |
| `highlights` | `string[]` | No | - | รายการจุดเด่นของสินค้า |
| `attributes` | `object` | No | Key-Value pairs | สเปคย่อสำหรับใช้กรองข้อมูล (Filters) |
| `attributesDetails` | `object` | No | Key-Value pairs | รายละเอียดสเปคเชิงลึกทั้งหมด |

### 3. Order (`orders.json`)

| Field | Type | Required | Key / Constraints | Description |
|---|---|:---:|---|---|
| `id` | `string` | Yes | Primary Key | รหัสคำสั่งซื้อ (เช่น `IHC-58188`) |
| `userId` | `string` | Yes | Foreign Key -> `User.id` | รหัสอ้างอิงผู้สั่งซื้อ |
| `date` | `string` | Yes | Format: `YYYY-MM-DD HH:mm` | วันและเวลาที่ทำรายการสั่งซื้อ |
| `items` | `array` | Yes | Non-empty Array | อาร์เรย์ของรายการสินค้า (`OrderItem`) |
| `total` | `number` | Yes | `min: 0` | ยอดชำระเงินรวมสุทธิ (บาท) |
| `status` | `string` | Yes | Enum: `รอชำระเงิน`, `รอดำเนินการ`, `จัดส่งแล้ว`, `เสร็จสิ้น` | สถานะคำสั่งซื้อ |
| `shippingAddress` | `string` | Yes | - | ที่อยู่สำหรับจัดส่งสินค้า |
| `recipientName` | `string` | Yes | - | ชื่อ-นามสกุลของผู้รับสินค้า |
| `recipientPhone` | `string` | Yes | - | เบอร์โทรศัพท์ติดต่อผู้รับ |
| `paymentMethod` | `string` | Yes | Enum: `PromptPay`, `CreditCard`, `BankTransfer` | ช่องทางการชำระเงิน |

### 4. Order Item

| Field | Type | Required | Key / Constraints | Description |
|---|---|:---:|---|---|
| `id` | `number` | Yes | Foreign Key -> `Product.id` | รหัสอ้างอิงสินค้า |
| `name` | `string` | Yes | Snapshot | ชื่อสินค้า ณ เวลาที่สั่งซื้อ |
| `brand` | `string` | Yes | Snapshot | แบรนด์สินค้า ณ เวลาที่สั่งซื้อ |
| `price` | `number` | Yes | Snapshot | ราคาต่อชิ้น ณ เวลาที่สั่งซื้อ |
| `quantity` | `number` | Yes | `min: 1` | จำนวนที่สั่งซื้อ |
| `image` | `string` | No | Snapshot | รูปภาพสินค้า ณ เวลาที่สั่งซื้อ |

## Relationships

- ผู้ใช้งาน 1 คน สามารถสร้างคำสั่งซื้อได้หลายรายการ (`1 : N`)
- คำสั่งซื้อ 1 รายการ ประกอบด้วยรายการสินค้าได้หลายรายการ (`1 : N`)
- สินค้า 1 ชนิด สามารถปรากฏอยู่ในรายการสั่งซื้อหลายรายการ (`N : 1`)
- เมื่อสร้างคำสั่งซื้อสำเร็จ ระบบจะทำการตัดสต็อกสินค้า (`stock`) ใน `products.json` โดยอัตโนมัติ

---

# 15. Sequence Diagrams

```mermaid
%%{init: {
  'theme': 'base',
  'themeVariables': {
    'primaryColor': '#ffffff',
    'primaryTextColor': '#000000',
    'primaryBorderColor': '#111111',
    'lineColor': '#222222',
    'secondaryColor': '#f8f9fa',
    'tertiaryColor': '#ffffff',
    'textColor': '#000000',
    'labelTextColor': '#000000',
    'actorLineColor': '#ffffff',
    'actorTextColor': '#ffffff',
    'actorBkg': '#000000',
    'actorBorder': '#222222',
    'signalColor': '#222222',
    'signalTextColor': '#000000',
    'labelBoxBkgColor': '#ffffff',
    'labelBoxBorderColor': '#222222',
    'loopTextColor': '#000000',
    'noteBkgColor': '#fff5ad',
    'noteTextColor': '#000000'
  }
}}%%
sequenceDiagram
    autonumber
    actor C as ลูกค้า (Customer)
    actor E as พนักงาน (Employee)
    actor M as ผู้จัดการ (Manager)
    participant S as การแสดงผล (System)
    participant DB_U as Users DB
    participant DB_P as Products DB
    participant DB_O as Orders DB

    %% ==========================================
    %% Use Case: เข้าสู่ระบบ (Authentication)
    %% ==========================================
    rect rgb(240, 248, 255)
    Note over C, DB_O: Use Case: ระบบเข้าสู่ระบบ (Authentication)
    
    alt ลูกค้าเข้าสู่ระบบ
        C->>S: กรอกข้อมูล Login / Register
    else พนักงานเข้าสู่ระบบ
        E->>S: กรอกข้อมูล Login
    else ผู้จัดการเข้าสู่ระบบ
        M->>S: กรอกข้อมูล Login
    end
    
    S->>DB_U: ตรวจสอบข้อมูลผู้ใช้และ Role (Validate credentials)
    DB_U-->>S: ส่งคืนข้อมูลและสิทธิ์ผู้ใช้งาน (Return access info)
    
    alt Role = Customer
        S-->>C: แสดงหน้าแรกของลูกค้า (Customer Home)
    else Role = Employee
        S-->>E: แสดงหน้าระบบจัดการคำสั่งซื้อ (Order Management)
    else Role = Manager
        S-->>M: แสดงหน้าแดชบอร์ด (Dashboard)
    end
    end

    %% ==========================================
    %% Use Case: ค้นหาสินค้า (Browse/Search)
    %% ==========================================
    rect rgb(255, 250, 240)
    Note over C, DB_O: Use Case: ค้นหาสินค้า (Browse/Search)
    
    C->>S: ค้นหาสินค้า / เลือกหมวดหมู่ (Browse/Search)
    S->>DB_P: เรียกดูข้อมูลสินค้า (Get products)
    
    opt มีการกรองข้อมูล (Filter)
        S->>DB_P: กรองตามหมวดหมู่, ราคา, ฯลฯ
    end
    
    DB_P-->>S: ส่งคืนรายการสินค้าที่ตรงกัน (Return matching items)
    S-->>C: แสดงรายการสินค้า (Show items)
    
    C->>S: คลิกดูรายละเอียดสินค้า (View Details)
    S->>DB_P: เรียกดูรายละเอียด, สเปก (Get details)
    DB_P-->>S: ส่งคืนข้อมูลสินค้า (Return product info)
    S-->>C: แสดงรายละเอียดสินค้า (Show details)
    end

    %% ==========================================
    %% Use Case: จัดการตะกร้าและสั่งซื้อ (Checkout)
    %% ==========================================
    rect rgb(240, 255, 240)
    Note over C, DB_O: Use Case: จัดการตะกร้า / สั่งซื้อ (Checkout)
    
    C->>S: เพิ่มลงตะกร้า / ยืนยันการสั่งซื้อ (Add to Cart / Checkout)
    S->>DB_O: สร้างคำสั่งซื้อสถานะ Pending (Create pending order)
    S->>DB_P: ตรวจสอบและจองสต็อก (Check and reserve stock)
    
    loop จองสต็อกสินค้าแต่ละชิ้น
        DB_P->>DB_P: หักจำนวนสต็อก (Deduct stock)
    end
    
    DB_P-->>S: ยืนยันสต็อกคงเหลือ (Return stock status)
    S-->>C: แสดงยอดรวมและให้ชำระเงิน (Show total)
    
    C->>S: ดำเนินการชำระเงิน (Payment)
    
    alt ชำระเงินสำเร็จ
        S->>DB_O: อัปเดตสถานะเป็น "ชำระเงินแล้ว/เตรียมส่ง" (Update status)
        DB_O-->>S: ยืนยันการสร้างออเดอร์ (Confirm order placed)
        S-->>C: แจ้งเตือนการสั่งซื้อสำเร็จ (Success message)
    end
    end

    %% ==========================================
    %% Use Case: ติดตามสถานะ (Track & History)
    %% ==========================================
    rect rgb(255, 240, 245)
    Note over C, DB_O: Use Case: ติดตามสถานะและประวัติ (Track Orders)
    
    C->>S: ติดตามสถานะคำสั่งซื้อ (Track Order)
    S->>DB_O: ดึงข้อมูลสถานะและ Tracking Number
    DB_O-->>S: ส่งข้อมูลคำสั่งซื้อ (Return order info)
    S-->>C: แสดงสถานะการจัดส่ง
    
    C->>S: ดูประวัติการสั่งซื้อทั้งหมด (View Order History)
    S->>DB_O: ดึงประวัติคำสั่งซื้อของลูกค้า
    DB_O-->>S: ส่งคืนรายการคำสั่งซื้อทั้งหมด
    S-->>C: แสดงประวัติคำสั่งซื้อ
    end

    %% ==========================================
    %% Use Case: จัดการโปรไฟล์ (Manage Profile)
    %% ==========================================
    rect rgb(255, 255, 224)
    Note over C, DB_O: Use Case: จัดการโปรไฟล์ (Manage Profile)
    
    C->>S: แก้ไขข้อมูลส่วนตัว / ที่อยู่ (Manage Profile)
    S->>DB_U: อัปเดตข้อมูลติดต่อ (Update address/contact)
    DB_U-->>S: ยืนยันการบันทึก (Confirm changes)
    S-->>C: แจ้งเตือนแก้ไขสำเร็จ
    end

    %% ==========================================
    %% Use Case: จัดการสต็อกและออเดอร์ (Employee)
    %% ==========================================
    rect rgb(230, 230, 250)
    Note over E, DB_O: Use Case: ตรวจสอบสต็อกและอัปเดตสถานะ (Employee)
    
    E->>S: ตรวจสอบสต็อกสินค้า (Check Stock)
    S->>DB_P: เรียกดูจำนวนสต็อกคงเหลือ
    DB_P-->>S: ส่งข้อมูลสต็อก (Return stock data)
    S-->>E: แสดงจำนวนสต็อก
    
    E->>S: อัปเดตสถานะการขนส่ง (Update Tracking Status)
    S->>DB_O: เรียกดูข้อมูลคำสั่งซื้อ
    DB_O-->>S: ส่งคืนข้อมูลคำสั่งซื้อ
    S->>DB_O: ตั้งค่าสถานะ (เตรียมส่ง / จัดส่งแล้ว / เสร็จสิ้น)
    DB_O-->>S: ยืนยันการอัปเดต (Confirm update)
    S-->>E: แจ้งเตือนอัปเดตสถานะสำเร็จ
    end

    %% ==========================================
    %% Use Case: สรุปภาพรวมและจัดการระบบ (Manager/Admin)
    %% ==========================================
    rect rgb(240, 255, 255)
    Note over M, DB_O: Use Case: สรุปภาพรวมและจัดการระบบทั้งหมด (Manager as Admin)
    
    M->>S: ดูสรุปยอดขาย (Sales Dashboard)
    S->>DB_O: ดึงข้อมูลและคำนวณยอดขาย (Aggregate sales data)
    DB_O-->>S: ส่งคืนตารางและสถิติ (Return tables and statistics)
    S-->>M: แสดงกราฟภาพรวม
    
    M->>S: จัดการสิทธิ์ผู้ใช้งาน (Manage Users / Change Role / Delete)
    S->>DB_U: ระงับสิทธิ์ หรือ อัปเดตบัญชี (Suspend/Update account)
    DB_U-->>S: ยืนยันการแก้ไข (Confirm change)
    S-->>M: แจ้งเตือนแก้ไขผู้ใช้สำเร็จ
    
    M->>S: จัดการข้อมูลสินค้า (Manage Products)
    alt เพิ่มสินค้าใหม่ (Add)
        S->>DB_P: Create new product
    else แก้ไขสินค้า (Update)
        S->>DB_P: Update product details
    else ลบสินค้า (Delete)
        S->>DB_P: Remove product
    end
    DB_P-->>S: ยืนยันการเปลี่ยนแปลง (Confirm action)
    S-->>M: แจ้งเตือนอัปเดตแคตตาล็อกสำเร็จ
    end
```


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

# 17. Prototype

## Image
![Prototype](/image/Prototype.gif)  

---
# 18. System Architecture

## Overview Architecture Diagram

```mermaid
graph TD
    subgraph Client_Layer ["1. Client Layer (Frontend - React + Vite)"]
        UI["React Web App (UI Components)"]
        State["React Context / State Management"]
        ClientStorage["Browser LocalStorage (Cart, Auth Token, Cache)"]
    end

    subgraph API_Gateway_Layer ["2. API & Service Layer (Backend - Node.js & Express)"]
        Router["Express Router (/api/*)"]
        
        subgraph Middlewares ["Middlewares"]
            AuthMW["authMiddleware (JWT Verification)"]
            AdminMW["adminMiddleware (Role: Admin)"]
            ManagerMW["managerMiddleware (Role: Manager)"]
        end
        
        subgraph Controllers ["Controllers / Business Logic"]
            AuthController["Auth & User Controller"]
            ProductController["Product & Stock Controller"]
            OrderController["Order Processing Controller"]
        end
    end

    subgraph Data_Layer ["3. Data Persistence Layer"]
        UserDB[("users.json")]
        ProductDB[("products.json")]
        OrderDB[("orders.json")]
    end

    UI -->|HTTP Requests / REST API| Router
    UI <--> State
    State <--> ClientStorage
    
    Router --> AuthMW
    Router --> AdminMW
    Router --> ManagerMW
    
    AuthMW --> AuthController
    AdminMW --> ProductController
    ManagerMW --> OrderController
    
    AuthController <--> UserDB
    ProductController <--> ProductDB
    OrderController <--> OrderDB
    OrderController -. Update Stock .-> ProductDB
```

## Layer Description

1. **Client Layer (React + Vite + Tailwind CSS)**:
   - รับผิดชอบหน้าจอ UI และการตอบสนองต่อผู้ใช้งาน (User Interface & User Experience)
   - จัดการ State ของระบบฝั่งผู้ใช้ เช่น ตะกร้าสินค้า (`cart`), สถานะการเข้าสู่ระบบ (`user`), และรายการสินค้าโปรด (`favorites`) ใน `localStorage`

2. **API & Service Layer (Node.js + Express)**:
   - ตรวจสอบความถูกต้องและสิทธิ์ผู้ใช้ด้วย **JWT (JSON Web Token)** ผ่าน Middleware (`authMiddleware`, `adminMiddleware`, `managerMiddleware`)
   - ควบคุม Business Logic การสั่งซื้อ การจัดการสินค้า และการเปลี่ยนสถานะคำสั่งซื้อ

3. **Data Layer (JSON File Storage)**:
   - เก็บข้อมูลหลักของระบบอย่างถาวรในรูปแบบไฟล์ JSON (`users.json`, `products.json`, `orders.json`)
   - มีระบบตัดสต็อกสินค้าใน `products.json` โดยอัตโนมัติเมื่อเกิดคำสั่งซื้อใหม่

