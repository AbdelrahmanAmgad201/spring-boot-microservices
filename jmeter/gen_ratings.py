# import csv
# import random

# # CONFIGURATION
# NUM_USERS = 500
# MIN_RATINGS_PER_USER = 20
# MAX_RATINGS_PER_USER = 20

# MOVIES_FILE = "movie_ids.csv"
# OUTPUT_FILE = "ratings.csv"

# # -----------------------------

# # Read movie IDs
# movie_ids = []
# with open(MOVIES_FILE, "r") as f:
#     for line in f:
#         movie_ids.append(line.strip())

# print(f"Loaded {len(movie_ids)} movie IDs")

# # Generate ratings
# rows = []

# for user_id in range(1, NUM_USERS + 1):
#     num_ratings = random.randint(MIN_RATINGS_PER_USER, MAX_RATINGS_PER_USER)
    
#     # pick unique movies for this user
#     user_movies = random.sample(movie_ids, min(num_ratings, len(movie_ids)))
    
#     for movie_id in user_movies:
#         rating = random.randint(1, 5)
#         rows.append([user_id, movie_id, rating])

# print(f"Generated {len(rows)} ratings")

# # Write CSV
# with open(OUTPUT_FILE, "w", newline="") as f:
#     writer = csv.writer(f)
#     writer.writerow(["userId", "movieId", "rating"])
#     writer.writerows(rows)

# print(f"Saved to {OUTPUT_FILE}")


import csv
import random

MOVIES_FILE = "movie_ids.csv"
RATINGS_FILE = "ratings.csv"
USERS_FILE = "users.csv"

movie_ids = []
with open(MOVIES_FILE, "r") as f:
    for line in f:
        val = line.strip()
        if val:
            movie_ids.append(val)

ratings_rows = []
users_rows = []

for movie_id in movie_ids:
    user_id = movie_id
    rating = random.randint(1, 5)
    ratings_rows.append([user_id, movie_id, rating])
    users_rows.append([user_id])

with open(RATINGS_FILE, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["userId", "movieId", "rating"])
    writer.writerows(ratings_rows)

with open(USERS_FILE, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["userId"])
    writer.writerows(users_rows)

print(f"Saved {RATINGS_FILE} and {USERS_FILE}")