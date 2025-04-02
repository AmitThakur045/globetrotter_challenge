from django.contrib import admin

# Register your models here.


# 100 k =>> session per min

# Num of active users  => 10 % of 100K -> 10K active users per minute

# 10 user -> 50 no of session present

# 10k api calls to create session per minute 
# 1 sec -> 10k / 60 =>  167 request secons tp create session


# 400 api request per seconds woulbe be comming

# wo


# submtion woperation 500ms  to one submission operation -> 300ms 

# submit -> check if right or not -> return result 
# if we have check 

# updating the user answer
# updating high score
# leadboard operation 
# -> async manner ( sqs -> lambda -> dedicated server)