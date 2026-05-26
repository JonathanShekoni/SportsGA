#Pushes selected season data to store on PostgreSql database

from flask import Flask, redirect, url_for
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players
from sqlalchemy import create_engine
import psycopg2 as pg
import pandas
import numpy


try:
    conn = pg.connect(
        host = 'localhost',
        database = 'PlayerStats',
        port =  5432,
        user = 'postgres',
        password = 'Lekan228899'

    )
except Exception as err:
    print("Something went wrong")
    print(err)

#Establishes connection to database

engine = create_engine('postgresql+psycopg2://postgres:Lekan228899@localhost:5432/PlayerStats')

#Attempts to input each player into database 
nba_players = players.get_active_players()
samples = nba_players

for sample in samples:
    player = playercareerstats.PlayerCareerStats(player_id= sample['id'])
    playerStats = player.career_totals_regular_season.get_data_frame()

    playerStats.to_sql(
        name = sample['first_name'],
        con = engine,
        if_exists = 'replace',
        index = False,
    )