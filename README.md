Yehouda Cohen 
347466765
Golan

// docker compose basic commands
// ===============================
docker-compose up -d
docker-compose down

// Enter to mogo shell inside the container
// =========================================
docker exec -it mongodb mongosh -u admin -p password123

// Enter to mysql shell inside the container
// ============================================
docker exec -it mysql mysql -u root -proot

// Connect directly to a specific database
-----------------------------------------
docker exec -it mysql mysql -u root -proot todos

1. Register User :  POST /api/auth/register body
2. Encrypt Message : POST /api/messages/encrypt body
3. Decrypt Message :  POST /api/messages/decrypt body
4.  My Profile  : GET /api/users/me headers
5.  List My Messages (bonus) : GET /api/messages headers
