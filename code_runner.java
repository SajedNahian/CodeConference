import java.io.*;

public class code_runner{
	public static void main(String[] args){
		String code;
		// for (int i = 0; i < args.length; i++) {
		// 	System.out.println(args[i]);
		// }
		StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < args.length - 2; i++) {
            stringBuilder.append(args[i] + ' ');
        }
        code = stringBuilder.toString().replaceAll("\\\\n", "\n").replaceAll("\\\\t", "\t");
		// System.out.println(code);
		String fileName = args[args.length - 2];
		String language = args[args.length - 1];

		try {
			writing_file(language, code, fileName);
		}
		catch (IOException e){
			System.out.println("file misread");
			e.printStackTrace();
            System.exit(-1);
		}
		String s = null;
		try {
			Process p = null;
			Process compiler = null;
			boolean compilationError = false;
			if (language.equals("python")){
				p = Runtime.getRuntime().exec("python " + fileName);
			}
			else if (language.equals("java")){
				try {
					compiler = Runtime.getRuntime().exec("javac " + fileName);

					BufferedReader stdError = new BufferedReader(new InputStreamReader(compiler.getErrorStream()));
					
					// read any errors from the attempted command
					// System.out.println("Here is the standard error of the command (if any):\n");
					while ((s = stdError.readLine()) != null) {
						compilationError = true;
						System.out.println(s);
					}
					
					compiler.waitFor();
					if (!compilationError) {
						p = Runtime.getRuntime().exec("java " + fileName.split("\\.")[0]);
					}
				} catch (InterruptedException e) {
					System.out.println("okay");
				}
			}
			
			if (!compilationError) {
				BufferedReader stdInput = new BufferedReader(new InputStreamReader(p.getInputStream()));
				BufferedReader stdError = new BufferedReader(new InputStreamReader(p.getErrorStream()));
				// System.out.println("Here is the standard output of the command:\n");
				while ((s = stdInput.readLine()) != null) {
					System.out.println(s);
				}
				
				// read any errors from the attempted command
				// System.out.println("Here is the standard error of the command (if any):\n");
				while ((s = stdError.readLine()) != null) {
					System.out.println(s);
				}
			}
			
	        System.exit(0);
	    }
        catch (IOException e) {
            System.out.println("exception happened - here's what I know: ");
            e.printStackTrace();
            System.exit(-1);
        }
			
	}
	public static void writing_file(String language, String code, String fileName) throws IOException{
		// BufferedWriter writer = null;
		// if (language.equals("python")){
		// 	writer = new BufferedWriter(new FileWriter(fileName));
		// }
		// else if (language.equals("java")){
		// 	writer = new BufferedWriter(new FileWriter(fileName));
		// }
		// writer = new BufferedWriter(new FileWriter(fileName));
		// writer.write(code);
		// writer.close();
		FileOutputStream fos = new FileOutputStream(fileName);
		fos.write(code.getBytes());
		fos.flush();
		fos.close();
	}
}