import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const auth = NextAuth(
    {
        providers: [
            CredentialsProvider({
                name: "Credentials",
                credentials: {
                    email: { label: "email", type: "text" },
                    password: { label: "Password", type: "password" }
                },
                async authorize(credentials, req) {
    
                    const {email, password} = credentials;
                    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
                        method: 'POST',
                        body: JSON.stringify({email,password}),
                      });
    
                      const result = await res.json();
                      
                      if (result.status == 1) {
                        return result.userInfo;
                      }else{
                        throw new Error(result.message);
                      }
                }
            })
        ],

        pages :
        {
            signIn : '/login'
        },
    
        callbacks: {
            async jwt({ token, user }) { 
                if (user) {                    
                    token.id = user.id,
                    token.email = user.email,
                    token.firstname = user.firstname,
                    token.lastname = user.lastname,
                    token.role = user.role,
                    token.plan = user.plan,
                    token.planStatus = user.planStatus,
                    token.noOfCampaigns = user.noOfCampaigns
                }
                return token
            },
            async session({ session, token }) { 
                if(token)
               {
                session.id = token.id,
                session.email = token.email,
                session.firstname = token.firstname,
                session.lastname = token.lastname
                session.role = token.role,
                session.plan = token.plan ,
                session.planStatus = token.planStatus,
                session.noOfCampaigns = token.noOfCampaigns
               }
                return session
            }
        },

        session : {
            strategy: "jwt",
            maxAge: 24 * 60 * 60, 
        }
    
    }
)

export  {auth as GET, auth as POST}
