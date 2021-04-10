using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;

namespace HighScores {

    public partial class Scores : System.Web.UI.Page {

        private readonly string connectionString =
            @"Data Source=(localdb)\MSSQLLocalDB;Database=db1;Integrated Security=True";
        string response = "";

        protected void Page_Load(object sender, EventArgs e) {
            if (Request.QueryString["apikey"] == "11") {
                switch (Request.QueryString["action"]) {
                    case "read": Read(); break;
                    case "write": Write(); break;
                    case "reset": Reset(); break;
                }
            }
            Response.Clear();
            //Response.ContentType = "application/json; charset=utf-8";
            Response.ContentType = "text/plain; charset=utf-8";
            Response.Write(response);
            Response.End();
        }

        private void Read() {
            string sql = "SELECT TOP 10 name, score FROM Scores ORDER BY CAST(score AS int) DESC";
            using (SqlDataAdapter adapter = new SqlDataAdapter(sql, connectionString)) {
                DataTable table = new DataTable();
                adapter.Fill(table);
                response = DataTableToJSON(table);
                if (table.Rows.Count != 0) {
                    foreach (DataRow row in table.Rows) {
                        response += ";" + row["name"] + "," + row["score"];
                    }
                    response = response.Substring(1);
                }
            }
        }

        private void Write() {
            string name = Request.QueryString["name"];
            string score = Request.QueryString["score"];
            if (name == "" || score == "") return;
            name = name.Substring(0, Math.Min(name.Length, 10)).Replace(",", "").Replace(";", "");
            score = score.Substring(0, Math.Min(score.Length, 6)).Replace(",", "").Replace(";", "");
            try {
                score = Int32.Parse(score).ToString(); // make sure score is really an integer
            } catch {
                return;
            }
            using (SqlConnection cnn = new SqlConnection(connectionString)) {
                cnn.Open();
                SqlCommand cmd = new SqlCommand(
                    "INSERT scores (timestamp, name, score, agent, address, browser)" +
                    "VALUES (@timestamp, @name, @score, @agent, @address, @browser)", cnn);
                cmd.Parameters.Add("@timestamp", SqlDbType.VarChar).Value = DateTime.Now.ToString();
                cmd.Parameters.Add("@name", SqlDbType.VarChar).Value =
                    name.Substring(0, Math.Min(10, name.Length)).Replace(",", "").Replace(";", "");
                cmd.Parameters.Add("@score", SqlDbType.VarChar).Value =
                    score.Substring(0, Math.Min(6, score.Length)).Replace(",", "").Replace(";", "");
                cmd.Parameters.Add("@agent", SqlDbType.VarChar).Value = Request.UserAgent;
                cmd.Parameters.Add("@address", SqlDbType.VarChar).Value = Request.UserHostAddress;
                cmd.Parameters.Add("@browser", SqlDbType.VarChar).Value = Request.Browser.Browser;
                cmd.ExecuteNonQuery();
            }
        }

        private void Reset() {
            using (SqlConnection cnn = new SqlConnection(connectionString)) {
                cnn.Open();
                SqlCommand cmd = new SqlCommand("DELETE FROM scores", cnn);
                cmd.ExecuteNonQuery();
            }
        }

        private string DataTableToJSON(DataTable table) {
            var list = new List<Dictionary<string, object>>();
            foreach (DataRow row in table.Rows) {
                var item = new Dictionary<string, object>();
                foreach (DataColumn col in table.Columns) {
                    item.Add(col.ColumnName, row[col]);
                }
                list.Add(item);
            }
            return new JavaScriptSerializer().Serialize(list);
        }
    }

    class ScoreData {
        public string name { get; set; }
        public string score { get; set; }
    }

}