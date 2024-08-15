# 專案名稱
PaulLiu-Ecommerce
## 專案介紹
本專案是根據Angular + Springboot建立的網頁專案，目的在於模擬一個電商平台應該有的基礎功能，其支持使用者搜索、透過商品類型查詢、註冊、登入等等功能。
## 環境依賴
### 1. 前端(Angular)
        Node.js: 20.15.0
        npm: 10.7.0
        Angular CLI: 18.0.6
        TypeScript: 4.6.4
### 2. 後端(SpringBoot)
       Open JDK: 21.0.2
       SpringBoot: 3.3.1
       maven wrapper
         - maven dependencies(artifact id):
             spring-boot-starter-data-jpa
             spring-boot-starter-data-rest
             mysql-connector-j:8.4.0
             lombok
             spring-boot-starter-test
             spring-boot-starter-security
             spring-boot-starter-validation
             spring-boot-starter-web
             jjwt-api
             jjwt-impl
             jjwt-jackson
             commons-lang3

## 專案架構
![Ecommerce Project Diagram-2](https://github.com/user-attachments/assets/2edcf9d6-555b-4e20-b746-b20ff3c6c34d)
## 主要功能
1. [搜索商品](https://youtu.be/jvHGoFVlLxg)![image](https://github.com/user-attachments/assets/d80757e4-8d43-4064-a3fd-5e1c82933261)
2. [根據不同的商品類型搜索](https://youtu.be/UUo6jktFrBo)![image](https://github.com/user-attachments/assets/2b651568-7d07-4d29-a2c7-78f27029f6f9)
3. [商品詳情](https://youtu.be/XCJnMgkTRhg)![image](https://github.com/user-attachments/assets/8b6d3910-68c2-4838-849e-f2546940f8fd)
4. [註冊](https://youtu.be/NLZJVfnEuUg)(前端表單驗證 + 後端判斷此username/email是否存在)![image](https://github.com/user-attachments/assets/622f7ee8-229d-4601-8c10-fc27622604a9)
5. [登入](https://youtu.be/RQ7whJptyvk)![image](https://github.com/user-attachments/assets/177665b1-4ebe-47a2-ad5a-f2250a830195)
6. [使用者必須登入後才能結帳](https://youtu.be/TWE1fFhdc-k)![image](https://github.com/user-attachments/assets/f175cc1c-34a5-45b9-9102-213556ec5183)
7. 使用jwt token來驗證使用者的身分，某些服務是需要使用者的身分有相應的訪問全限![image](https://github.com/user-attachments/assets/02dba359-6a2c-46a3-901e-122325eaa0dd)
8. [修改基本資料](https://youtu.be/wyB8KP7JAik)(不能與其他用戶重名、不能與其他用戶擁有相同的email、必須更改為不同的密碼)![image](https://github.com/user-attachments/assets/fa493740-34d3-4d20-8848-72342036e115)
9. [查看訂單](https://youtu.be/tk7E8J83NZU)![image](https://github.com/user-attachments/assets/8242760c-4144-4288-a748-d84fd1c0c20a)
10. [結帳](https://youtu.be/Mkx8IpKtD38)![image](https://github.com/user-attachments/assets/490824ca-4928-47d1-adfa-e7faa44150b2)![image](https://github.com/user-attachments/assets/b7db3150-babd-42b1-9ae2-ea5b41c1a12a)![image](https://github.com/user-attachments/assets/c1b29d4e-af9a-495b-950c-03719562effb)











