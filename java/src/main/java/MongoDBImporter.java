import java.io.FileInputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.bson.Document;


public class MongoDBImporter {

    private static String HOST_NAME = "localhost";
    private static String DB_NAME = "balance";

    private static MongoClient mongoClient;
    private static MongoDatabase database;

    public static void main(String[] args) throws Exception {
        try {
            initDB();
            importToDB();
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
    
    public static void importToDB() throws Exception {
        Workbook wb = null;
        FileInputStream fileInput = null;
        try {
            fileInput = new FileInputStream("data/dummy_data.xlsx");
            wb = new XSSFWorkbook(fileInput);
            DataFormatter formatter = new DataFormatter();

            for (int i = 0; i < wb.getNumberOfSheets(); i++) { // sheet
                Sheet sheet = wb.getSheetAt(i);
                String[] fields = null;
                List<Document> docs = new ArrayList<>();
                for (Row row: sheet) { // row
                    Document doc = new Document();                        
                    for (int j = 0; j < row.getLastCellNum(); j++) { // cell
                        Cell cell = row.getCell(j);
            
                        if (cell == null) {
                            continue;
                        }

                        if (row.getRowNum() == 0) {
                            // first row contains the names of fields of a table (document in MongoDB)
                            if (fields == null) {
                                fields = new String[row.getLastCellNum()];
                            }
                            // get the text that appears in the cell by getting the cell value and applying any data formats (Date, 0.00, 1.23e9, $1.23, etc)
                            String text = formatter.formatCellValue(cell);
                            fields[j] = text;
                            continue;
                        }

                        String field = fields[j];

                        // get the value and format it yourself
                        switch (cell.getCellTypeEnum()) {
                            case STRING:
                                doc.append(field, cell.getRichStringCellValue().getString());
                                break;
                            case NUMERIC:
                                if (DateUtil.isCellDateFormatted(cell)) {
                                    String strDate = formatter.formatCellValue(cell);
                                    if (strDate.matches("[0-9]{2}:[0-9]{2}")) {
                                        doc.append(field, strDate);
                                        break;
                                    }

                                    SimpleDateFormat sdFormat;
                                    if (strDate.matches("[0-9]{1,2}/[0-9]{1,2}/[0-9]{2}")) {
                                        sdFormat = new SimpleDateFormat("MM/dd/yy");
                                    } else {
                                        sdFormat = new SimpleDateFormat("MM/dd/yy hh:mm");                                        
                                    }
                                    Date date = sdFormat.parse(strDate);
                                    doc.append(field,  date);
                                } else {
                                    doc.append(field, (int) cell.getNumericCellValue());
                                }
                                break;
                            case BOOLEAN:
                                doc.append(field, cell.getBooleanCellValue());
                                break;
                            default:
                                
                        }
                    }
                    if (row.getRowNum() > 0) {
                        docs.add(doc);
                    }
                }
                MongoCollection<Document> collection = database.getCollection(sheet.getSheetName());
                // collection.drop(); // comment in if you want to drop table
                collection.insertMany(docs); // if data exist, throw error 
                System.out.println(docs.size() + " objects of the " + sheet.getSheetName() + " collection have been registered.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (fileInput != null) {
                fileInput.close();                
            }
            if (wb != null) {
                // wb.close();
            }
        }
    }   
}