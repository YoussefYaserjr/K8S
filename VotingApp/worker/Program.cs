// Define options once outside the loop
var options = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true
};

while (true)
{
    var voteData = db.ListRightPop("votes_queue");
    if(voteData.HasValue)
    {
        // Add the options here to handle "option" vs "Option"
        var vote = JsonSerializer.Deserialize<Vote>(voteData, options);
        
        using var cmd = new NpgsqlCommand("INSERT INTO votes(option_name) VALUES(@opt)", pgConn);
        cmd.Parameters.AddWithValue("opt", vote.Option);
        cmd.ExecuteNonQuery();
        Console.WriteLine($"Processed vote for: {vote.Option}");
    }
    System.Threading.Thread.Sleep(100);
}