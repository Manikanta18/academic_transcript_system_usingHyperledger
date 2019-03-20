/**
 * Create Transcript Transaction
 * @param {org.iiitv.ats.transcript.SubmitTranscript} transcriptData
 * @transaction
 */

 function   submitTrancript(transcriptData) {

    // 1. Get the asset registry
    return getAssetRegistry('org.iiitv.ats.transcript.Transcript')
        .then(function(transcriptRegistry){

            //now add the transcript
            var factory = getFactory();
            var NS = 'org.iiitv.ats.transcript';

            // create a transcript resource
            var transcriptId = transcriptData.transcriptId;
            var transcript = factory.newResource(NS,'Transcript',transcriptId);

            // get student details of given id
            var student =  getParticipantRegistry(org.iiitv.ats.institute.Student)
            .then(function(participantRegistry){
                if(participantRegistry.exits(transcriptData.studentId)){
                    return student.add(participantRegistry.get(transcriptData.studentId));
                };
            }).catch(function(error){
                throw new Error(error);
            });

            transcript.studentId = transcriptData.studentId;
            transcript.studentName = student.studentName;
            transcript.departmentType = student.departmentType;
            transcript.batchYear = student.batchYear;

            // create a instance of semesterOne concept
            var semesterOne = factory.newConcept(NS,"SemesterOne");

            // set data into semesterOne
            semesterOne.el101 = transcriptData.el101;
            semesterOne.ma101 = transcriptData.ma101;
            semesterOne.it101 = transcriptData.it101;
            semesterOne.it102 = transcriptData.it102;
            semesterOne.ph101 = transcriptData.ph101;
            semesterOne.hm101 = transcriptData.hm101;
            semesterOne.spi = transcriptData.spi;
            semesterOne.cpi = transcriptData.cpi; 
            
            transcript.semesterOne = semesterOne;

            // emit event transcript created
            var event = factory.newEvent(NS, 'TranscriptSubmitted');
            event.transcriptId = transcriptId;
            emit(event);


            // add to registry
            return transcriptRegistry.add(transcript);

        });


    

 };  