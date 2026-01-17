cmake_minimum_required(VERSION 3.20)
project(personal_learning_hub LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Drogon REQUIRED)
add_executable(personal_learning_hub
    src/main.cpp
)

target_link_libraries(personal_learning_hub
    PRIVATE
    Drogon::Drogon
)
