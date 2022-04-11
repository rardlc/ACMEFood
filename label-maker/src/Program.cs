using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;

namespace openXMLParseNEdit
{
    public class InputArchiveNotFound : Exception
    {
        public InputArchiveNotFound()
        {
            Console.WriteLine("-1: Input Archive was not found");
        }

        public InputArchiveNotFound(string message)
            : base(message)
        {
            Console.WriteLine("-1 :Input Archive was not found");
        }

        public InputArchiveNotFound(string message, Exception inner)
            : base(message, inner)
        {
            Console.WriteLine("-1 :Input Archive was not found but also...");
            throw inner;
        }
    }
    class Program
    {

        static void Main(string[] args)
        {
            string inputZip;
            if (args.Length > 0)
            {
                inputZip = args[0];
            } else
            {
                //Console.WriteLine("Please enter the PATH of the label zip/archive.");
                inputZip = Console.ReadLine();
            }

            string outputDir;

            if (args.Length > 1)
            {
                outputDir = args[1];

            } else
            {
                //Console.WriteLine("Please enter the PATH of where you want this script to write outputs to. Leaving this blank will leave your results in your desktop inside a folder called {DESKTOP}/word-out");
                outputDir = Console.ReadLine();

            }

            if (outputDir.Length <= 0)
            {
                outputDir = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                //Console.WriteLine("Saved to: {0}", outputDir.ToString());
            }

            String[] csvFilePaths = Array.Empty<string>();

            while (csvFilePaths.Length <= 0)
            {
                try
                {
                   csvFilePaths = ExtractCSV(inputZip, outputDir);
                }
                catch (InputArchiveNotFound)
                {
                    //Console.WriteLine("-1: Input Archive was not found at {0}", inputZip);
                    //Console.WriteLine("Please input the path again?"); 
                    inputZip = Console.ReadLine();
                }
            }
            string outputFiles = "";

            if (csvFilePaths.Length > 0)
            {
                foreach (String csvPath in csvFilePaths)
                {
                    
                    //Console.WriteLine("Parsing CSV to add to Doc: ");
                    //Console.Write(csvPath);
                    outputFiles += DocParse(csvPath, outputDir) + " ";
                }
            }
            else
            {
                //Console.WriteLine("Something went wrong while unzipping, or the compressed archive was empty");
            }

            //Console.Out.WriteLine(outputFiles);
            //Console.Out.Close();
            StreamWriter sw = new StreamWriter(Console.OpenStandardOutput());
            sw.AutoFlush = true;
            Console.SetOut(sw);
            Console.Out.Write(outputFiles);

        }

        static String[] ExtractCSV(String archivePath, String workingDir)
        {
            //Directory.CreateDirectory(workingDir + "/zip");

            if ( File.Exists(archivePath) )
            {
                DirectoryInfo inDir = Directory.CreateDirectory(workingDir + "/csv-in");
                try
                {
                    ZipFile.ExtractToDirectory(archivePath, inDir.FullName);
                    Console.WriteLine("CSVs Extracted successfully");
                    return Directory.GetFiles(inDir.FullName,"*.csv");
                }
                catch (IOException)
                {
                    //Console.WriteLine("You need to include a zip folder with the name: " + csvZipName);
                    //Console.WriteLine("Try again once you have done so. Stacktrace incoming");
                    //Console.WriteLine(e.ToString());
                    Console.WriteLine("Extracted files already exist at this location. Would you like to proceed with deleting them? ('Y','n')");

                    string res = Console.ReadLine();

                    if (res.Length > 0 && res[0] == "n"[0])
                    {
                        throw;
                    }

                    //delete all files in \\csv-in
                    foreach (FileInfo item in inDir.GetFiles("*.csv") )
                    {
                        File.Delete(item.FullName);
                    }

                    ZipFile.ExtractToDirectory(archivePath, inDir.FullName);
                    Console.WriteLine("CSVs Extracted successfully");
                    return Directory.GetFiles(inDir.FullName,"*.csv");

                    
                }
            }
            else if(Directory.Exists(archivePath))
            {
                String[] res = Directory.GetFiles(archivePath,"*.csv");
                if (res.Length > 0)
                {
                    //Console.WriteLine("Found some files in" + archivePath.ToString());
                    return res;
                }
                else
                {
                    throw new InputArchiveNotFound("Archive/CSVs do not exist at: " + archivePath + ". Please include your input Zip/Archive/Dir to CSVs. ");
                }

            } else
            {
                throw new InputArchiveNotFound("Archive/CSVs do not exist at: " + archivePath + ". Please include your input Zip/Archive/Dir to CSVs. ");
            }
        }

        static string DocParse(String csvPath, String workingDir)
        {
            DirectoryInfo outDir = Directory.CreateDirectory(workingDir);

            List<string> firstNames = new List<string>();
            List<string> lastNames = new List<string>();
            List<string> dietIds = new List<string>();
            List<string> mealType = new List<string>();
            List<string> dates = new List<string>();
            List<string> dishDescriptions = new List<string>();
            List<string> cals = new List<string>();
            List<string> carbs = new List<string>();
            List<string> prots = new List<string>();
            List<string> fats = new List<string>();
            List<string> mealTime = new List<string>();


            using (var reader = new StreamReader(csvPath))
            {
                //reading excel
                var rowNum = 0;

                reader.ReadLine();

                while (!reader.EndOfStream)
                {
                    //reading header

                    //reading values
                    var line = reader.ReadLine();

                    //reading values
                    if (line != null)
                    {
                        var values = line.Split(',');
                        mealTime.Add(values[0]);
                        firstNames.Add(values[1]);
                        lastNames.Add(values[2]);
                        dietIds.Add(values[3]);
                        dates.Add(values[5]);
                        dishDescriptions.Add(values[6]);
                        cals.Add(values[7]);
                        carbs.Add(values[8]);
                        prots.Add(values[9]);
                        fats.Add(values[10]);
                        rowNum++;
                    }
                }
            }
            File.Delete(csvPath);

            string outWordFilename = Path.GetFileNameWithoutExtension(csvPath);
            if( File.Exists(outDir + "/" + outWordFilename + ".docx"))
            {
                File.Delete(outDir + "/" + outWordFilename + ".docx");
            }

            //copy the template of a label document

            //for linux releases
            File.Copy(@"/home/pat/ACMEFood/label-maker/portable/Resources/label-template.docx", outDir + "/" + outWordFilename + ".docx");
            //for windows releases
            //File.Copy(@"./Resources/label-template.docx", outDir + "/" + outWordFilename + ".docx");


            using (var document = WordprocessingDocument.Open(outDir + "/" + outWordFilename + ".docx", true))
            {
                //STYLING ----------------------------------------------------------
                Styles s = document.MainDocumentPart.StyleDefinitionsPart.Styles;

                StyleDefinitionsPart part =
                 document.MainDocumentPart.StyleDefinitionsPart;
                // If the Styles part does not exist, add it and then add the style.
                if (part == null)
                {
                    part = AddStylesPartToPackage(document);
                }



                var doc = document.MainDocumentPart.Document;

                const int maxLabelsPerPage = 30;

                int numberOfLabelPagesRequired = (int)Math.Ceiling((Decimal)firstNames.Count / maxLabelsPerPage);
                var tables = doc.Body.Elements<Table>().ToArray();
                Table tableRef = tables[0];

                //start at 1 because we always have one table
                for (int i = 1; i < numberOfLabelPagesRequired; i++)
                {
                    Table addedTable = (Table) tableRef.Clone();
                    doc.Body.Append(addedTable);
                }

                doc.Save();
                document.Close();
            }


            using (var document = WordprocessingDocument.Open(outDir + "/" + outWordFilename + ".docx", true))
            {
                var doc = document.MainDocumentPart.Document;

                var tables = doc.Body.Elements<Table>();
                int i = 0;
                while (i < firstNames.Count)
                {

                    foreach (TableCell labelOrNotCell in doc.Body.Descendants<TableCell>())
                    {
                        //get pPr of this cell
                        var cellPprs = labelOrNotCell.Descendants<ParagraphProperties>().ToList();
                        bool isLabel = false;

                        //find out if this cell was meant to have the AvertyStyle1 which is the style of label cells
                        foreach (ParagraphProperties pPr in cellPprs)
                        {
                            if (pPr.ParagraphStyleId.Val == "AveryStyle1")
                            {
                                isLabel = true;
                            }
                        }

                        if (isLabel)
                        {
                            if (i < firstNames.Count)
                            {
                                var ps = labelOrNotCell.Elements<Paragraph>().ToList();

                                ps[0].Append(
                                    new Run(
                                        new RunProperties(new Bold()),
                                        new Text(firstNames[i] + " "),
                                        new Text(lastNames[i]),
                                        new Break()
                                    ),
                                    new Run(
                                        new RunProperties(new FontSize() { Val = "16" }),
                                        new Text(mealTime[i] + " "),
                                        new Text(dates[i]),
                                        new Break()
                                    ),
                                    new Run(
                                        new RunProperties(new RunFonts() { Ascii = "Arial Narrow" }, new Caps() ),
                                        new Text(dishDescriptions[i]), new Break(),
                                        new Text("Cal: " + cals[i] + "/ Carb: " + carbs[i] + "g/ Fat: " + fats[i] + "g/ P: " + prots[i] + "g")
                                    )
                                );
                                i++;
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                }
            }

            return outDir + "/" + outWordFilename + ".docx";
        }


        public static StyleDefinitionsPart AddStylesPartToPackage(WordprocessingDocument doc)
        {
            // Add a StylesDefinitionsPart to the document.  Returns a reference to it.

            StyleDefinitionsPart part;
            part = doc.MainDocumentPart.AddNewPart<StyleDefinitionsPart>();
            Styles root = new Styles();
            root.Save(part);
            return part;
        }

        public static bool IsStyleIdInDocument(WordprocessingDocument doc,
            string styleid)
        {
            // Return true if the style id is in the document, false otherwise.

            // Get access to the Styles element for this document.
            Styles s = doc.MainDocumentPart.StyleDefinitionsPart.Styles;

            // Check that there are styles and how many.
            int n = s.Elements<Style>().Count();
            if (n == 0)
                return false;

            // Look for a match on styleid.
            Style style = s.Elements<Style>()
                .Where(st => (st.StyleId == styleid) && (st.Type == StyleValues.Paragraph))
                .FirstOrDefault();
            if (style == null)
                return false;

            return true;
        }


        //private static void AddNewStyle(StyleDefinitionsPart styleDefinitionsPart,
        //    string styleid, string stylename)
        //{
        //    // Create a new style with the specified styleid and stylename and add it to the specified
        //    // style definitions part.

        //    // Get access to the root element of the styles part.
        //    Styles styles = styleDefinitionsPart.Styles;

        //    // Create a new paragraph style and specify some of the properties.
        //    Style style = new Style()
        //    {
        //        Type = StyleValues.Paragraph,
        //        StyleId = styleid,
        //        CustomStyle = true
        //    };


        //    StyleName styleName1 = new StyleName() { Val = stylename };
        //    //BasedOn basedOn1 = new BasedOn() { Val = "Normal" };
        //    //NextParagraphStyle nextParagraphStyle1 = new NextParagraphStyle() { Val = "Normal" };



        //    style.Append(styleName1);
        //    //style.Append(basedOn1);
        //    //style.Append(nextParagraphStyle1);

        //    // Create the StyleRunProperties object and specify some of the run properties.
        //    StyleRunProperties styleRunProperties1 = new StyleRunProperties();
        //    //Bold bold1 = new Bold();
        //    //Color color1 = new Color() { ThemeColor = ThemeColorValues.Accent2 };
        //    RunFonts font1 = new RunFonts() { Ascii = "Arial Narrow" };
        //    //Italic italic1 = new Italic();

        //    // Specify a 12 point size.
        //    FontSize fontSize1 = new FontSize() { Val = "24" };

        //    styleRunProperties1.Append(bold1);
        //    styleRunProperties1.Append(color1);
        //    styleRunProperties1.Append(font1);
        //    styleRunProperties1.Append(fontSize1);
        //    styleRunProperties1.Append(italic1);

        //    // Add the run properties to the style.
        //    style.Append(styleRunProperties1);

        //    // Add the style to the styles part.
        //    styles.Append(style);
        //}
    }
}
