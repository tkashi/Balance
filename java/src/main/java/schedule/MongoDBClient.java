package schedule;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.conversions.Bson;


public class MongoDBClient {

    private static String HOST_NAME = "localhost";
    private static String DB_NAME = "test";


    // private static Calendar BASE_DATE;

    // static {
    //     SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy/MM/dd");
    //     BASE_DATE = Calendar.getInstance();
    //     BASE_DATE.setTime(sdFormat.parse("2017/09/06"));
    // }

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

        Calendar today = Calendar.getInstance();
        today.set(Calendar.HOUR_OF_DAY, 0);

        Bson query = and(eq("type", "incoming"));
        List<Task> tasks = new ArrayList<>();
        for (Document doc: collection.find()) {
            tasks.add(new Task((int)((Double)doc.get("_id") * 1), (int)((Double)doc.get("duration")*1), (int)((Double)doc.get("dueDate")*1), (int)((Double)doc.get("urgency")*1), (int)((Double)doc.get("importance")*1)));
        }
        return tasks;
    }
}