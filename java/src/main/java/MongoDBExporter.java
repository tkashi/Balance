import java.io.File;
import java.io.FileOutputStream;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.bson.Document;


public class MongoDBExporter {

    private static String HOST_NAME = "ec2-184-72-209-108.compute-1.amazonaws.com";
    private static String DB_NAME = "balance";

    private static MongoClient mongoClient;
    private static MongoDatabase database;

    public static void main(String[] args) throws Exception {
        try {
            initDB();
            exportFromDB();
        } catch (Exception e) {
            //TODO: handle exception
        } finally {
            closeDB();
        }
    }

    public static void initDB() {
        mongoClient = new MongoClient(HOST_NAME);
        database = mongoClient.getDatabase(DB_NAME);
    }

    public static void closeDB() {
        mongoClient.close();
    }
   
    public static void exportFromDB() throws Exception {
        Workbook wb = null;
        FileOutputStream fileOutput = null;
        try {
            File file = (new File("data/db_data_exported.xlsx"));
            file.createNewFile();
            fileOutput = new FileOutputStream(file);
            wb = new XSSFWorkbook();

            for (String name: database.listCollectionNames()) {
                MongoCollection<Document> collection = database.getCollection(name);

                Sheet sheet = wb.createSheet(name);

                Object[] keys = null;
                int rownum = 1;
                for (Document doc: collection.find()) {

                    if (keys == null) {
                        // insert names of fields at 1st row
                        Row row = sheet.createRow(0);
                        int column = 0;
                        for (String key: doc.keySet()) {
                            row.createCell(column).setCellValue(key);
                            column++;
                        }
                        keys = doc.keySet().toArray();
                    }

                    Row row = sheet.createRow(rownum);
                    for (int i = 0; i < keys.length; i++) {
                        Object value = doc.get(keys[i]);
                        if (value != null) {
                            row.createCell(i).setCellValue(value.toString());                            
                        }
                    }
                    rownum++;
                }
            }
            wb.write(fileOutput);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (fileOutput != null) {
                fileOutput.close();                
            }
            if (wb != null) {
                // wb.close();
            }
        }
    }
}