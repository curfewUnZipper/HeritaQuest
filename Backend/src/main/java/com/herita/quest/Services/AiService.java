package com.herita.quest.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.herita.quest.Entity.*;
import com.herita.quest.Repository.UserRepo;
import org.apache.commons.lang3.StringEscapeUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AiService {
    @Autowired
    private UserRepo userRepo;

    @Value("${gemini.api.url}")
    private String gemini_api_url;

    @Value("${gemini.api.key}")
    private String gemini_api_key;

    public final WebClient webClient;

    public AiService(WebClient.Builder webClient) {
        this.webClient = webClient.build();
    }

    @Transactional
    public LocationQuiz getAnswere(String question,String username) throws IOException {
        User user=userRepo.findByUsername(username);
        String Prompt= "Generate a single JSON object for a multiple-choice question (MCQ) quiz. The quiz should contain 5 unique questions based on the topic:"+question+".\n" +
                "\n" +
                "The JSON object must have two top-level fields:\n" +
                "\n" +
                "1.  `name`: A String representing a consistent, descriptive name for the entire quiz based on the overall topic.\n" +
                "2.  `questions`: A JSON Array containing exactly 5 question objects.\n" +
                "\n" +
                "Each object within the `questions` array must have the following three fields:\n" +
                "\n" +
                "1.  `question_text`: A String containing the full text of the multiple-choice question.\n" +
                "2.  `options`: A JSON Array of exactly 4 Strings, representing the possible answer choices for the question. The correct answer must be present within this array.\n" +
                "3.  `correct_answer`: A String that exactly matches one of the options provided in the `options` array, indicating the correct answer.\n" +
                "\n" +
                "Ensure the entire output is a valid JSON object, with no additional text or formatting outside the JSON.\n" +
                "\n" +
                "Example of desired output structure:\n" +
                "{\n" +
                "  \"name\": \"Kargal, Sagara taluk, Shimoga, Karnataka Local Phrases Quiz\",\n" +
                "  \"questions\": [\n" +
                "    {\n" +
                "      \"question_text\": \"How do you politely say 'Hello' in Kannada?\",\n" +
                "      \"options\": [\n" +
                "        \"Namaskara\",\n" +
                "        \"Dhanyavadagalu\",\n" +
                "        \"Oota aayitha\",\n" +
                "        \"Estu\"\n" +
                "      ],\n" +
                "      \"correct_answer\": \"Namaskara\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"question_text\": \"What phrase would you use to ask 'How much?' for an item?\",\n" +
                "      \"options\": [\n" +
                "        \"Beku?\",\n" +
                "        \"Beda?\",\n" +
                "        \"Estu?\",\n" +
                "        \"Sari?\"\n" +
                "      ],\n" +
                "      \"correct_answer\": \"Estu?\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"question_text\": \"How would you politely ask 'Did you have food?' (a common way to show care)?\",\n" +
                "      \"options\": [\n" +
                "        \"Neeru beka?\",\n" +
                "        \"Oota aayitha?\",\n" +
                "        \"Hegiddera?\",\n" +
                "        \"Chennagidini?\"\n" +
                "      ],\n" +
                "      \"correct_answer\": \"Oota aayitha?\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"question_text\": \"If you want to say 'Thank you' to someone, what phrase would you use?\",\n" +
                "      \"options\": [\n" +
                "        \"Namaskara\",\n" +
                "        \"Dhanyavadagalu\",\n" +
                "        \"Yen Guru\",\n" +
                "        \"Jujubi\"\n" +
                "      ],\n" +
                "      \"correct_answer\": \"Dhanyavadagalu\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"question_text\": \"To say 'I want' or 'I need' something, what is the appropriate word?\",\n" +
                "      \"options\": [\n" +
                "        \"Beda\",\n" +
                "        \"Sari\",\n" +
                "        \"Beku\",\n" +
                "        \"Estu\"\n" +
                "      ],\n" +
                "      \"correct_answer\": \"Beku\"\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        String text=callGemini(Prompt);
        JsonNode res=extractQuizJson(text);

        LocationQuiz quiz=new LocationQuiz();
        quiz.setMarks(0);
        quiz.setName(res.get("name").asText());
        List<LocationQuizQuestion> quizQuestions = new ArrayList<>();
            for (JsonNode questionNode : res.get("questions")) {
                LocationQuizQuestion ques = new LocationQuizQuestion();
                ques.setQuestion_text(questionNode.get("question_text").asText());
                List<String> options = new ArrayList<>();
                for (JsonNode optns : questionNode.get("options")) {
                    options.add(optns.asText());
                }
                ques.setOptions(options);
                ques.setCorrect_answer(questionNode.get("correct_answer").asText());

                ques.setQuiz(quiz);
                quizQuestions.add(ques);
            }
            quiz.setQuestions(quizQuestions);
            quiz.setUser(user);
            user.getQuizzes().add(quiz);
            return userRepo.save(user).getQuizzes().getLast();
    }

    @Transactional
    public FBQuiz generateFBQuiz(String question, String username) {
        User user=userRepo.findByUsername(username);
        String Prompt= "Generate a single JSON object for a fill-in-the-blank quiz. The quiz should contain 5 unique questions based on the topic:"+question+" ,it contain location and theme "+
                "The JSON object must have two top-level fields:\n" +
                "\n" +
                "1.  `name`: A String representing a consistent, descriptive name for the entire quiz (e.g., \"Space Exploration Quiz\" or \"Spanish Vocabulary Basics\").\n" +
                "2.  `questions`: A JSON Array of 5 question objects.\n" +
                "\n" +
                "Each object within the `questions` array must have the following three String fields:\n" +
                "\n" +
                "1.  `question`: The fill-in-the-blank question, using '________' (eight underscores) to clearly denote the blank space.\n" +
                "2.  `correctAns`: The single, exact correct answer for the blank.\n" +
                "3.  `hint`: A concise and helpful hint for the question.\n" +
                "\n" +
                "Ensure the entire output is a valid JSON object, with no additional text or formatting outside the JSON.\n" +
                "\n" +
                "Example of desired output structure:\n" +
                "{\n" +
                "  \"name\": \"History of Space Exploration Quiz\",\n" +
                "  \"questions\": [\n" +
                "    {\n" +
                "      \"question\": \"The first human to orbit Earth was Soviet cosmonaut _________.\",\n" +
                "      \"correctAns\": \"Yuri Gagarin\",\n" +
                "      \"hint\": \"His mission was Vostok 1 in 1961.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"question\": \"NASA's Apollo 11 mission was the first to land humans on the _________.\",\n" +
                "      \"correctAns\": \"Moon\",\n" +
                "      \"hint\": \"Neil Armstrong was the first to step out.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"question\": \"The Hubble Space Telescope primarily observes in the _________ and infrared spectra.\",\n" +
                "      \"correctAns\": \"ultraviolet\",\n" +
                "      \"hint\": \"It was launched into low Earth orbit in 1990.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"question\": \"The first reusable spacecraft system developed by NASA was the Space _________.\",\n" +
                "      \"correctAns\": \"Shuttle\",\n" +
                "      \"hint\": \"Its first orbital flight was in 1981.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"question\": \"The Cassini-Huygens mission was a joint NASA/ESA/ASI robotic spacecraft that studied the planet _________ and its moons.\",\n" +
                "      \"correctAns\": \"Saturn\",\n" +
                "      \"hint\": \"It operated for nearly 20 years, from 1997 to 2017.\"\n" +
                "    }\n" +
                "  ]\n" +
                "}" ;

        String text=callGemini(Prompt);
        JsonNode res=extractQuizJson(text);

        FBQuiz quiz=new FBQuiz();
        quiz.setMarks(0);
        quiz.setName(res.get("name").asText());
        List<FBQuizQuestion> quizQuestions = new ArrayList<>();
        for (JsonNode questionNode : res.get("questions")) {
            FBQuizQuestion ques = new FBQuizQuestion();
            ques.setQuestion(questionNode.get("question").asText());
            ques.setHint(questionNode.get("hint").asText());
            ques.setCorrectAns(questionNode.get("correctAns").asText());
            quizQuestions.add(ques);
            ques.setQuiz(quiz);
        }
        quiz.setQuestions(quizQuestions);
        quiz.setUser(user);
        user.getFbQuiz().add(quiz);
        return userRepo.save(user).getFbQuiz().getLast();
    }

    public static JsonNode extractQuizJson(String response) {
        Pattern pattern = Pattern.compile("```json\\s*(.*?)\\s*```", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(response);

        if (matcher.find()) {
            String jsonEscaped = matcher.group(1);

            // Unescape Java-style escaped characters (if embedded in Java string)
            String jsonString = StringEscapeUtils.unescapeJava(jsonEscaped).trim();

            ObjectMapper mapper = new ObjectMapper();
            try {
                return mapper.readTree(jsonString);
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse JSON: " + e.getMessage(), e);
            }
        } else {
            return null;
        }
    }



    public String callGemini(String question){
        //        Construct Request as gemini accept in particular manner
        Map<String , Object> requestBody=Map.of("contents",new Object[]{Map.of("parts",new Object[]{Map.of("text",question)})});

        //        API call
        String response =webClient.post()
                .uri(gemini_api_url+gemini_api_key)
                .header("Content-Type",
                        "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class).
                block();
        JSONObject root=new JSONObject(response);
        String text=root.getJSONArray("candidates")
                .getJSONObject(0)
                .getJSONObject("content")
                .getJSONArray("parts")
                .getJSONObject(0)
                .getString("text");
        return text;
    }
}

