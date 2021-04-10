using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Web.Script.Serialization;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace Asteroids {

    public sealed class HighScores {

        private static HighScores instance = null;
        public static HighScores Instance { get => instance ?? (instance = new HighScores()); }

        public int lowestHighScore = 0;
        DataTable table;
        List<ScoreData> list;
        //readonly List<ScoreData> list = new List<ScoreData>();
        //readonly string apiUrl = "https://localhost:44377/scores.aspx";
        readonly string connectionString = @"Data Source=(localdb)\MSSQLLocalDB;Database=db1;Integrated Security=True";

        struct ScoreData {
            public string name { get; set; }
            public string score { get; set; }
        }

        private HighScores() { }

        public void Read() {
            table = new DataTable();
            string sql =
                "SELECT TOP 10 name, score FROM HighScores " +
                "ORDER BY CAST(score AS int) DESC";
            using (var adapter = new SqlDataAdapter(sql, connectionString)) {
                adapter.Fill(table);
            }
            if (table.Rows.Count == 10)
                lowestHighScore = Int32.Parse(table.Rows[9]["score"].ToString());
        }

        public void ReadWeb() {

            list = new List<ScoreData>();

            //list.Clear();
            //list.Add(new ScoreData() { name = "Loading...", score = "" });
            //WebClient client = new WebClient();
            //client.DownloadStringAsync(new Uri($"{apiUrl}?apikey=11&action=read"));
            //client.DownloadStringCompleted += (sender, response) => {
            //    list = new JavaScriptSerializer().Deserialize<List<ScoreData>>(response.Result);
            //    //string[] rows = response.Result.Split(';');
            //    //foreach (string row in rows) {
            //    //    string[] fields = row.Split(',');
            //    //    list.Add(new ScoreData() { name = fields[0], score = fields[1] });
            //    //}
            //    if (list.Count == 10) lowestHighScore = Int32.Parse(list[9].score);
            //};
        }

        public void Write(string name, string score) {
            name = name.Substring(0, Math.Min(name.Length, 10)).Replace(",", "").Replace(";", "");

            using (var cnn = new SqlConnection(connectionString)) {
                cnn.Open();
                var cmd = new SqlCommand();
                cmd.Connection = cnn;
                cmd.CommandText = "INSERT HighScores (name, score) VALUES (@name, @score)";
                cmd.Parameters.Add("@name", SqlDbType.VarChar).Value = name;
                cmd.Parameters.Add("@score", SqlDbType.VarChar).Value = score;
                cmd.ExecuteNonQuery();
            }
        }

        public void WriteWeb(string name, string score) {
            //name = WebUtility.UrlEncode(name.Replace(",", "").Replace(";", ""));

            //WebClient client = new WebClient();
            //string url = $"{apiUrl}?apikey=11&action=write&name={name}&score={score}";
            //client.DownloadString(url);
        }

        public void Draw(SpriteBatch spriteBatch, SpriteFont font) {
            if (table.Rows.Count != 0) {
                spriteBatch.DrawString(font, "High Scores", new Vector2(558, 80), Color.Wheat);
                float y = 150;
                foreach (DataRow row in table.Rows) {
                    string text = $"{row["name"],-10} {row["score"],6}";
                    spriteBatch.DrawString(font, text, new Vector2(500, y), Color.White);
                    y += 32;
                }
            }
        }

        public void DrawWeb(SpriteBatch spriteBatch, SpriteFont font) {
            if (list.Count != 0) {
                spriteBatch.DrawString(font, "High Scores", new Vector2(558, 80), Color.Wheat);
                float y = 150;
                foreach (ScoreData item in list) {
                    string text = $"{item.name,-10} {item.score,6}";
                    spriteBatch.DrawString(font, text, new Vector2(500, y), Color.White);
                    y += 32;
                }
            }
        }

    }
}
