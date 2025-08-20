import { UserAchievementDto } from "../types/achievement";
import { LoginUserDto, RegisterUserDto, ResetPasswordDto, ResetPasswordRequest, UserAnonymousStatus } from "../types/auth";
import { AvatarUpdateDto } from "../types/avatar";
import { ResultDto } from "../types/result";
import { FeedBackDto } from "../types/settings";

//.env url
const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

// // Login.tsx
//Login function (login.tsx)
export const loginUser = async (user: LoginUserDto) => {
            //send login post with user body to api
            try{
            const res = await fetch(`${backendUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            })

            //data contains JWT token for authentication
            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message || "En uventet feil har oppstått");
            }

            return data;
        }catch(error: any){
            console.log(error.message)
        }
}

// // Register folder
//Register user function 
export const createUser = async (user: RegisterUserDto) => {
    try{
    const res = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });


      const data = await res.json();
      console.log(JSON.stringify(data))

      if(!res.ok){
        throw new Error(data.message || "En uventet feil har oppstått")
      }
      return data;
    }catch(error: any){
        console.log(error.message)
    }
}

// // Register folder
//Set user anonymous status 
export const setAnonymousUser = async (user: UserAnonymousStatus, token: string | null) => {
  
    const res = await fetch(`${backendUrl}/api/players/anonstatus`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(user),
      });

      const data = await res.json();

     if(!res.ok){
        throw new Error(data.message || "En uventet feil har oppstått")
      }

      return data;

}

// //registrering/glemt-passord.tsx
//Post request for password-reset request (email with link and token)
export const postPasswordResetRequest = async (resetPasswordRequest: ResetPasswordRequest) => {
  try{
    const res = await fetch(`${backendUrl}/api/auth/forgot-password`,{
      method: "POST",
      headers: {"Content-Type": "application/json"}, 
      body: JSON.stringify(resetPasswordRequest)
    })

    const data = await res.json();

    if(!res.ok){
       throw new Error(data.message || "En uventet feil har oppstått")
     }

     return data;

   }catch(error: any){
       console.log(error.message)
   }
  }

// //reset.tsx
//Post request for password-reset
export const resetPassword = async (resetPasswordDto: ResetPasswordDto) => {
  try{ 
    const res = await fetch(`${backendUrl}/api/auth/reset-password`,{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(resetPasswordDto)
    }) 

    const data = await res.json();

    if(!res.ok){
       throw new Error(data.message || "En uventet feil har oppstått")
     }

     return data;
     
  }catch(error:any){
    console.log(error.message)
  }
}

//PATCH request to change username
export const changeUsername = async (newUsername: string, token: string) => {
  try{ 
    const res = await fetch(`${backendUrl}/api/players`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({newUsername: newUsername})
    })

    const data = await res.json();
    console.log("Data fra api", JSON.stringify(data))

    if(!res.ok){
       throw new Error(JSON.stringify(data) || "En uventet feil har oppstått")
     }

     return data;
     
  }catch(error:any){
    console.log(error.message)
  }
}


// //tabs/index.tsx
//Get section list
export const getSections = async () => {
    try{
    const res = await fetch(`${backendUrl}/api/quiz`, {
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message || "En uventet feil har oppstått")
      }
      return data; 

    }catch(error: any){
        console.log(error.message)
    }
}

// //tabs/index.tsx
//Check user completion status on sections
export const checkResultStatus = async (username: string, sectionId: number, token: string | null ) => {
    try{
    const res = await fetch(
        `${backendUrl}/api/result/status/${username}/${sectionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );
      
      const data = await res.json();

      console.log(data)

      if (!res.ok) {
        throw new Error(data.message || "En uventet feil har oppstått")
      }

      return data;
    }catch(error: any){
        console.log(error.message)
    }
}

// //tabs/ledertavle.tsx
//Get leaderboard list of users descending based on score
export const getLeaderboard = async () => {
    try{
        const res = await fetch(`${backendUrl}/api/result/leaderboard`, {
            method: "GET",
            headers: { "Content-type": "application/json" },
          });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "En uventet feil har oppstått")
        }
  
        return data;
        
    }catch(error: any){
        console.log(error.message)
    }
}

// //moduler/[id].tsx
//Get list of avatars
//Use string as type due to usage of (  const { id } = useLocalSearchParams();) in id.tsx
export const getQuestions = async (sectionId: string) => {
  try{

    const res = await fetch(`${backendUrl}/api/question/${sectionId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "En uventet feil har oppstått")
      }

      return data;
      
  }catch(error: any){
      console.log(error.message)
  }
}

// //moduler/[id]/question.tsx
//Post user result
export const postResult = async (resultDto: ResultDto, token: string |null) => {
  try{
    const res = await fetch(`${backendUrl}/api/result`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(resultDto),
    });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "En uventet feil har oppstått")
      }

      return data;
      
  }catch(error: any){
      console.log(error.message)
  }
}

// //moduler/[id]/question.tsx
//Post user result
export const postAchievement = async (userAchievementDto: UserAchievementDto, token: string) => {
  try{

    const res = await fetch(`${backendUrl}/api/userachievement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userAchievementDto),
    });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "En uventet feil har oppstått")
      }

      return data;
      
  }catch(error: any){
      console.log(error.message)
  }
}

// //moduler/[id]/game-done.tsx
//Get section achievement
export const getAchievementById = async (achievementId: number) => {
  try{
    const res = await fetch(`${backendUrl}/api/appachievement/${achievementId}`, {
      headers: { "Content-Type": "application/json" },
    });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "En uventet feil har oppstått")
      }

      return data;
      
  }catch(error: any){
      console.log(error.message)
  }
}

// //moduler/[id]/game-done.tsx
//Get section achievement
export const getUserAchievementById = async (achievementId: number, token: string) => {
  try{
    const res = await fetch(`${backendUrl}/api/userachievement/me/${achievementId}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
    });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "En uventet feil har oppstått")
      }

      return data;
      
  }catch(error: any){
      console.log(error.message)
  }
}

// //tabs/profile
//Get list of avatars
export const getAvatars = async () => {
    try{
        const res = await fetch(`${backendUrl}/api/avatar/allavatars`);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "En uventet feil har oppstått")
        }
  
        return data;
        
    }catch(error: any){
        console.log(error.message)
    }
}

// //tabs/profile
//Get users avatar
export const getAvatar = async (username: string) => {
    try{
        const res = await fetch(
            `${backendUrl}/api/players/avatar/${username}`
          );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "En uventet feil har oppstått")
        }
  
        return data;
        
    }catch(error: any){
        console.log(error.message)
    }
}

// //tabs/profile
//Update users avatar id
export const selectUserAvatar = async (avatarUpdateDto: AvatarUpdateDto) => {

        try{
        //PATCH for å endre players avatarId
        const res = await fetch(`${backendUrl}/api/players/avatar`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(avatarUpdateDto),
        });
        const data = await res.json();
        return data;
        }catch(error: any){
          console.log(error.message)
        }


}

// //tabs/profile
//Get users next result to deteremine next section to play
export const getUserNextResult = async (username: string, token: string | null) => {
  try{

    const res = await fetch(`${backendUrl}/api/result/nextresult/${username}`,{
      headers: {"Content-Type" : "application/json", Authorization: `Bearer ${token}`}
    });

    const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "En uventet feil har oppstått")
      }

      return data;
      
  }catch(error: any){
      console.log(error.message)
  }
}

// //tabs/profile
//Get relevant section in terms of NextResult if nextresult datatype == result
export const getSection = async (sectionId: number) => {
  try{

    const res = await fetch(
      `${backendUrl}/api/quiz/${sectionId}`
    );

    const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "En uventet feil har oppstått")
      }

      return data;
      
  }catch(error: any){
      console.log(error.message)
  }
}

// //tabs/profile
//Get list of users achievements
export const getUserAchievements = async (token: string) => {
  try{
      const res = await fetch(`${backendUrl}/api/userachievement/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "En uventet feil har oppstått")
      }

      return data;
      
  }catch(error: any){
      console.log(error.message)
  }
}



// //instillinger/[id].tsx
//Get terms (Vises ikke i instillinger i app?)
export const getTerms = async () => {
    try{
        const res = await fetch(`${backendUrl}/api/settings/terms`, {
            headers: { "Content-Type": "application/json" },
        });
        
        const data = await res.json();

        if(!res.ok){
            throw new Error(data.message || "En uventet feil har oppstått");
        }

        return data;
        
    }catch(error:any){
        console.log(error.message)
    }
}

// //instillinger/[id].tsx
//Get FAQ 
export const getFaq = async () => {
    try{
        const res = await fetch(`${backendUrl}/api/settings/faq`, {
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message || "En uventet feil har oppstått");
      }

      return data;
    }catch(error: any){
        console.log(error.message)
    }    
}


// //instillinger/[id].tsx
//Get sources 
export const getSources = async () => {

    try{
      const res = await fetch(`${backendUrl}/api/settings/sources`, {
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();    

      if(!res.ok){
        throw new Error(data.message || "En uventet feil har oppstått");
      }
      return data;
    }catch(error: any){
        console.log(error.message);
    }
}

// //instillinger/[id].tsx
//Get about us 
export const getAboutUs = async () => {

    try{
      const res = await fetch(`${backendUrl}/api/settings/about`, {
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();    

      if(!res.ok){
        throw new Error(data.message || "En uventet feil har oppstått")
      }

      return data;
    }catch(error: any ){
        console.log(error.message)
    }
}

// //instillinger/[id].tsx
//Get privacy
export const getPrivacy = async () => {
    try{

        const res = await fetch(`${backendUrl}/api/settings/privacy`, {
            headers: { "Content-Type": "application/json" },
          });
    
        const data = await res.json();    

        if(!res.ok){
          throw new Error(data.message || "En uventet feil har oppstått")
        }
  
        return data;        
    }catch(error:any){
        console.log(error.message)
    }
}

//Send feedback (uses identifier to specify type)
//"COMMENT" or "SCORE"
export const sendFeedBack = async (feedbackDto: FeedBackDto, token: string |null) => {
  try{
    const res = await fetch(`${backendUrl}/api/feedback`, {
      method: "POST",
      headers: {"Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(feedbackDto)
    })

    const data = await res.json();    

    if(!res.ok){
      throw new Error(data.message || "En uventet feil har oppstått")
    }

    return data;      

  }catch(error: any){
    console.log(error.messae)
  }
}
