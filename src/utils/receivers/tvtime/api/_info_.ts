//?o=https://api2.tozelabs.com/v2/user/91990879&fields=shows.fields(id,name,poster,filters,sorting,watched_episode_count,aired_episode_count,status,is_followed,is_up_to_date,is_archived,is_for_later,is_favorite,fanart).offset(0).limit(500)
//?o=https://api2.tozelabs.com/v2/user/91990879&fields=shows.fields(id,name,poster,filters,sorting,watched_episode_count,aired_episode_count,status,is_followed,is_up_to_date,is_archived,is_for_later,is_favorite,fanart).offset(0).limit(500)
// https://msapi.tvtime.com/prod/v1/tracking/watches/user/91990879&entity_type=movie
// https://msapi.tvtime.com/prod/v1/tracking/cgw/follows/user/91990879
// https://msapi.tvtime.com/prod/v1/tracking/cgw/follows/user/91990879&entity_type=movie&sort=watched_date,desc
// https://msapi.tvtime.com/prod/v1/tracking/cgw/watchlist/movies/user/91990879
// https://msapi.tvtime.com/prod/v1/movies/a86a35fc-6c9e-459b-b54b-6160b0c9cb9c&random=true
//
// Calendar
// https://api2.tozelabs.com/v2/user/91990879/to_watch&offset=0&limit=21&filter=not_started_yet&include_country=1
//
// Old api with imdb result
// https://api2.tozelabs.com/v2/discover/shows&offset=0&limit=12&fields=id,name,compatibility_rating,season_count,status,network,all_images&sort=most_popular&status=continuing
//
//
// Semi Working
// https://app.tvtime.com/sidecar?o=https%3A%2F%2Fmsapi.tvtime.com%2Fprod%2Fv1%2Ftracking%2Fcgw%2Ffollows%2Fuser%2F91990879&entity_type=series&sort=watched_date%2Cdesc&filter=progress%5Bwatching%5D
//{
// 	"shows_filtering": {
// 		"filters": [
// 			{
// 				"id": "progress",
// 				"name": "Progress",
// 				"options": [
// 					{
// 						"filter": "watching",
// 						"display": "Watching"
// 					},
// 					{
// 						"filter": "not_started_yet",
// 						"display": "Haven't started"
// 					},
// 					{
// 						"filter": "up_to_date",
// 						"display": "Up to date"
// 					},
// 					{
// 						"filter": "finished",
// 						"display": "Finished"
// 					},
// 					{
// 						"filter": "stopped_watching",
// 						"display": "Stopped"
// 					}
// 				]
// 			}
// 		],
// 		"grouping": {
// 			"id": "progress-grouping",
// 			"name": "Group by progress",
// 			"default": true,
// 			"filter_id": "progress"
// 		},
// 		"sort": [
// 			{
// 				"sort": "last_watched",
// 				"display": "Last watched",
// 				"order": "desc"
// 			},
// 			{
// 				"sort": "last_added",
// 				"display": "Last added",
// 				"order": "desc"
// 			},
// 			{
// 				"sort": "alphabetical",
// 				"display": "Alphabetical",
// 				"order": "asc"
// 			}
// 		]
// 	}
// }
//
// Movies all types
// Page-Last-Key: DX8EAQL/gAABDAEMAAAk/4AAAgVoX2tleQg5MTk5MDg3OQVyX2tleQoxNzQxMzczOTIw
// Page-Limit: 20
// o=https://msapi.tvtime.com/prod/v1/tracking/cgw/follows/user/91990879
// entity_type=movie
// sort=watched_date,desc
// filter=not_watched
//
//
//{
// 	"options": [
// 		{
// 			"filter": "watching",
// 			"display": "Watching"
// 		},
// 		{
// 			"filter": "not_started_yet",
// 			"display": "Haven't started"
// 		},
// 		{
// 			"filter": "up_to_date",
// 			"display": "Up to date"
// 		},
// 		{
// 			"filter": "finished",
// 			"display": "Finished"
// 		},
// 		{
// 			"filter": "stopped_watching",
// 			"display": "Stopped"
// 		}
// 	]
// }
//
//
// Series (New Endpoint)
//{
// 	"data": {
// 		"air_time": "20:00",
// 		"aired_episode_count": 42,
// 		"characters": [
// 			{
// 				"actor_id": 375458,
// 				"actor_name": "Brandon Micheal Hall",
// 				"actor_uuid": "5423d9b7-7b54-4da7-b907-39ce86d5dba9",
// 				"id": 63559710,
// 				"image_url": "https://artworks.thetvdb.com/banners/actors/492026.jpg",
// 				"is_deleted": false,
// 				"name": "Miles Finer",
// 				"type": "character",
// 				"uuid": "5423d9b7-7b54-4da7-b907-39ce86d5dba9"
// 			},
// 			{
// 				"actor_id": 480330,
// 				"actor_name": "Violett Beane",
// 				"actor_uuid": "404c78ca-3e61-4fab-8c1e-dcf61f049986",
// 				"id": 63559711,
// 				"image_url": "https://artworks.thetvdb.com/banners/actors/492028.jpg",
// 				"is_deleted": false,
// 				"name": "Cara Bloom",
// 				"type": "character",
// 				"uuid": "404c78ca-3e61-4fab-8c1e-dcf61f049986"
// 			},
// 			{
// 				"actor_id": 8194548,
// 				"actor_name": "Javicia Leslie",
// 				"actor_uuid": "f258011a-365d-4e8f-ba9c-a8d3f90b9ae7",
// 				"id": 63559712,
// 				"image_url": "https://artworks.thetvdb.com/banners/actors/492029.jpg",
// 				"is_deleted": false,
// 				"name": "Ali Finer",
// 				"type": "character",
// 				"uuid": "f258011a-365d-4e8f-ba9c-a8d3f90b9ae7"
// 			},
// 			{
// 				"actor_id": 327368,
// 				"actor_name": "Suraj Sharma",
// 				"actor_uuid": "0b07f942-3bed-4f7a-8845-97b926b28a26",
// 				"id": 63559713,
// 				"image_url": "https://artworks.thetvdb.com/banners/actors/492030.jpg",
// 				"is_deleted": false,
// 				"name": "Rakesh Sehgal",
// 				"type": "character",
// 				"uuid": "0b07f942-3bed-4f7a-8845-97b926b28a26"
// 			},
// 			{
// 				"actor_id": 273078,
// 				"actor_name": "Joe Morton",
// 				"actor_uuid": "56b88d33-c3ed-4791-b05e-323f27131f12",
// 				"id": 63559714,
// 				"image_url": "https://artworks.thetvdb.com/banners/actors/492758.jpg",
// 				"is_deleted": false,
// 				"name": "Arthur Finer",
// 				"type": "character",
// 				"uuid": "56b88d33-c3ed-4791-b05e-323f27131f12"
// 			}
// 		],
// 		"country": "US",
// 		"day_of_week": "Sunday",
// 		"fanart": [
// 			{
// 				"favorite_count": 100001,
// 				"id": 1349662,
// 				"is_deleted": false,
// 				"language": "en",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/fanart/original/5c97f15a71ed5_t.jpg",
// 				"type": "fanart",
// 				"url": "https://artworks.thetvdb.com/banners/fanart/original/5c97f15a71ed5.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100001,
// 				"id": 1294148,
// 				"is_deleted": false,
// 				"language": "en",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/fanart/original/5b44011361016_t.jpg",
// 				"type": "fanart",
// 				"url": "https://artworks.thetvdb.com/banners/fanart/original/5b44011361016.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100001,
// 				"id": 62044238,
// 				"is_deleted": false,
// 				"language": "",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/series/349684/backgrounds/62044238_t.jpg",
// 				"type": "fanart",
// 				"url": "https://artworks.thetvdb.com/banners/series/349684/backgrounds/62044238.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100001,
// 				"id": 1394532,
// 				"is_deleted": false,
// 				"language": "",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/fanart/original/5da5afff90ed3_t.jpg",
// 				"type": "fanart",
// 				"url": "https://artworks.thetvdb.com/banners/fanart/original/5da5afff90ed3.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100000,
// 				"id": 62035742,
// 				"is_deleted": false,
// 				"language": "",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/series/349684/backgrounds/62035742_t.jpg",
// 				"type": "fanart",
// 				"url": "https://artworks.thetvdb.com/banners/series/349684/backgrounds/62035742.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100000,
// 				"id": 1303850,
// 				"is_deleted": false,
// 				"language": "en",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/fanart/original/5b8738a9bccef_t.jpg",
// 				"type": "fanart",
// 				"url": "https://artworks.thetvdb.com/banners/fanart/original/5b8738a9bccef.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100000,
// 				"id": 1294221,
// 				"is_deleted": false,
// 				"language": "en",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/fanart/original/5b448d238d05b_t.jpg",
// 				"type": "fanart",
// 				"url": "https://artworks.thetvdb.com/banners/fanart/original/5b448d238d05b.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100000,
// 				"id": 1294228,
// 				"is_deleted": false,
// 				"language": "en",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/fanart/original/5b44950e3a205_t.jpg",
// 				"type": "fanart",
// 				"url": "https://artworks.thetvdb.com/banners/fanart/original/5b44950e3a205.jpg",
// 				"uuid": ""
// 			}
// 		],
// 		"first_air_date": "2018-09-30",
// 		"first_episode": {
// 			"id": 6743248,
// 			"uuid": "c76c9dbd-46f5-4809-9199-cf8a50d763eb"
// 		},
// 		"genres": [
// 			"Fantasy",
// 			"Drama",
// 			"Comedy",
// 			"Mystery"
// 		],
// 		"id": 349684,
// 		"imdb_id": "tt7948998",
// 		"language": "en",
// 		"name": "God Friended Me",
// 		"network": "CBS",
// 		"overview": "An atheist's life is turned upside down when he is \"friended\" by God on Facebook.",
// 		"posters": [
// 			{
// 				"favorite_count": 100001,
// 				"id": 1317441,
// 				"is_deleted": false,
// 				"language": "en",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/posters/5bdb414e53592_t.jpg",
// 				"type": "poster",
// 				"url": "https://artworks.thetvdb.com/banners/posters/5bdb414e53592.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100001,
// 				"id": 1314409,
// 				"is_deleted": false,
// 				"language": "en",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/posters/5bc7753a0d1ae_t.jpg",
// 				"type": "poster",
// 				"url": "https://artworks.thetvdb.com/banners/posters/5bc7753a0d1ae.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100001,
// 				"id": 1386407,
// 				"is_deleted": false,
// 				"language": "en",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/posters/5d76a8ad5ccab_t.jpg",
// 				"type": "poster",
// 				"url": "https://artworks.thetvdb.com/banners/posters/5d76a8ad5ccab.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100000,
// 				"id": 62356788,
// 				"is_deleted": false,
// 				"language": "en",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/series/349684/posters/5f7ee1a7bb10b_t.jpg",
// 				"type": "poster",
// 				"url": "https://artworks.thetvdb.com/banners/series/349684/posters/5f7ee1a7bb10b.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100000,
// 				"id": 1294222,
// 				"is_deleted": false,
// 				"language": "en",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/posters/5b448d98a92b2_t.jpg",
// 				"type": "poster",
// 				"url": "https://artworks.thetvdb.com/banners/posters/5b448d98a92b2.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 100000,
// 				"id": 62550415,
// 				"is_deleted": false,
// 				"language": "en",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/v4/series/349684/posters/6064da3d10b19_t.jpg",
// 				"type": "poster",
// 				"url": "https://artworks.thetvdb.com/banners/v4/series/349684/posters/6064da3d10b19.jpg",
// 				"uuid": ""
// 			},
// 			{
// 				"favorite_count": 0,
// 				"id": 1317519,
// 				"is_deleted": false,
// 				"language": "ru",
// 				"thumb_url": "https://artworks.thetvdb.com/banners/posters/5bdbfbb74d3bd_t.jpg",
// 				"type": "poster",
// 				"url": "https://artworks.thetvdb.com/banners/posters/5bdbfbb74d3bd.jpg",
// 				"uuid": ""
// 			}
// 		],
// 		"rating": 47310,
// 		"reviews": null,
// 		"runtime": 45,
// 		"seasons": [
// 			{
// 				"id": 770208,
// 				"number": 0,
// 				"translations": [],
// 				"uuid": ""
// 			},
// 			{
// 				"id": 770209,
// 				"number": 1,
// 				"translations": [],
// 				"uuid": ""
// 			},
// 			{
// 				"id": 814705,
// 				"number": 2,
// 				"translations": [],
// 				"uuid": ""
// 			}
// 		],
// 		"status": "Ended",
// 		"timezone": "America/New_York",
// 		"trailers": [
// 			{
// 				"embeddable": false,
// 				"id": 4160,
// 				"name": "God Friended Me Official Trailer",
// 				"runtime": 372,
// 				"thumb_url": "https://i.ytimg.com/vi/o6XfmicoyZw/mqdefault.jpg",
// 				"type": "",
// 				"url": "https://www.youtube.com/watch?v=o6XfmicoyZw&frags=pl%2Cwn",
// 				"uuid": "",
// 				"language": ""
// 			}
// 		],
// 		"translations": [],
// 		"type": "series",
// 		"uuid": "0f4af707-6aa7-42c0-a508-dba4a272162e",
// 		"utc_air_time": "00:00",
// 		"utc_first_air_date": "2018-10-01"
// 	}
// }
