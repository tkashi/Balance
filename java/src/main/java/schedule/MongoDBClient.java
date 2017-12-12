package schedule;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;

import org.bson.Document;
import org.bson.conversions.Bson;


public class MongoDBClient {

    private static String HOST_NAME = "localhost";
    private static String DB_NAME = "test";

    private static MongoClient mongoClient;
    private static MongoDatabase database;

    public MongoDBClient() {
        initDB();        
    }

    public void initDB() {
        mongoClient = new MongoClient(HOST_NAME);
        database = mongoClient.getDatabase(DB_NAME);
    }

    public void closeDB() {
        mongoClient.close();
    }
   
    public List<Task> readTasks(int planHorizon) throws Exception {
        MongoCollection<Document> collection = database.getCollection("task");

        Bson query = and(eq("type", "incoming"));
        List<Task> tasks = new ArrayList<>();
        for (Document doc: collection.find(query)) {
            tasks.add(new Task((Integer)doc.get("_id"), (Integer)doc.get("duration"), (Integer)doc.get("dueDateTime"), (Integer)doc.get("urgency"), (Integer)doc.get("importance")));
        }
        return tasks;
    }
    
    public int[] readTotalHoursPerDate(int today, int planHorizon) {
    	
        MongoCollection<Document> collection = database.getCollection("task");
	    AggregateIterable<Document> cursor = collection.aggregate(
	    		      Arrays.asList(
	    		              Aggregates.match(Filters.and(Filters.eq("type", "allocated"), Filters.gte("date", today), Filters.lte("date", today + planHorizon))),
	    		              Aggregates.group("$date", Accumulators.sum("duration", 1)),
	    		              Aggregates.sort(new BasicDBObject("_id", 1))
	    		      )
	    		);
	    
	    int[] ret = new int[planHorizon + 1];
	    for (int i = 1; i <= planHorizon; i++) {
	    		int d = today + i;	    		
	    	    for (Document doc: cursor) {
	    	    		if (doc.getInteger("_id").intValue() == d) {
	    	    			ret[i] = doc.getInteger("duration");
	    	    		}
		    }
	    }
	    return ret;
    }
}