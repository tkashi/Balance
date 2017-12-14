package schedule;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
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
    private static String DB_NAME = "balance";

    private static MongoClient mongoClient;
    private static MongoDatabase database;
    
    private static int BASE_DATE;
    static {
    		Calendar baseDate = Calendar.getInstance();
    		baseDate.set(2017, 8, 6);
    		System.out.println(baseDate.getTime().toString());
    		System.out.println(baseDate.getTimeInMillis());
    		BASE_DATE = (int) (baseDate.getTimeInMillis() / 1000 / 60 / 60 / 24);
    }

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
            tasks.add(convertFromDoc(doc));
        }
        return tasks;
    }
    
    private Task convertFromDoc(Document doc) {
		int today = getToday();

		int duration = doc.get("duration") != null ? (Integer)doc.get("duration") : -1;
		int dueDateTime = doc.get("dueDateTime") != null ? (Integer)doc.get("dueDateTime") - today: -1;
		int urgency = doc.get("urgency") != null ? (Integer)doc.get("urgency") : 0;
		int importance = doc.get("importance") != null ? (Integer)doc.get("importance") : 0;
    	
    		return new Task((String)doc.get("_id"), duration, dueDateTime, urgency, importance);
    }
    
    private int getToday() {
		return (int) (Calendar.getInstance().getTimeInMillis() / 1000 / 60 / 60 / 24) - BASE_DATE;
    }
    
    public int[] readTotalHoursPerDate(int planHorizon) {
    		int today = getToday();
    	
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
	    	    		if (doc.getLong("_id").intValue() == d) {
	    	    			ret[i] = doc.getInteger("duration");
	    	    		}
		    }
	    }
	    return ret;
    }

	public void updateTasks(List<Task> taskList) {
		int today = getToday();
		
        MongoCollection<Document> collection = database.getCollection("task");
        for (Task t: taskList) {
        		Document doc = new Document("date", t.getTaskDay() + today);
        		doc.append("type", "allocated");
            collection.updateOne(eq("_id", t.getId()), new Document("$set", doc));        	
        }
		
	}
}