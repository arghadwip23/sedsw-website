// lib/emailTemplates.ts
export default function verificationEmailTemplate(name: string, verificationLink: string): string {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>🚀 Launch Your SEDS Journey</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');
      
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .star {
        position: absolute;
        background: white;
        border-radius: 50%;
        animation: twinkle 2s infinite;
      }
      
      .rocket {
        animation: float 3s ease-in-out infinite;
      }
      
      .verify-btn {
        animation: pulse 2s infinite;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
    
    <!-- Starfield Background -->
    <div style="position: relative; width: 100%; min-height: 100vh; overflow: hidden;">
      <div class="star" style="width: 2px; height: 2px; top: 10%; left: 15%; animation-delay: 0s;"></div>
      <div class="star" style="width: 1px; height: 1px; top: 20%; left: 80%; animation-delay: 0.5s;"></div>
      <div class="star" style="width: 2px; height: 2px; top: 30%; left: 25%; animation-delay: 1s;"></div>
      <div class="star" style="width: 1px; height: 1px; top: 15%; left: 70%; animation-delay: 1.5s;"></div>
      <div class="star" style="width: 2px; height: 2px; top: 45%; left: 90%; animation-delay: 2s;"></div>
      <div class="star" style="width: 1px; height: 1px; top: 60%; left: 5%; animation-delay: 0.3s;"></div>
      <div class="star" style="width: 2px; height: 2px; top: 75%; left: 85%; animation-delay: 1.2s;"></div>
      <div class="star" style="width: 1px; height: 1px; top: 85%; left: 30%; animation-delay: 1.8s;"></div>
      
      <!-- Email Container -->
      <table width="100%" cellspacing="0" cellpadding="0" style="padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background: rgba(0, 0, 0, 0.9); border-radius: 20px; overflow: hidden; border: 1px solid #333; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
              
              <!-- Header Section -->
              <tr>
                <td style="position: relative; padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #000000 0%, #1a1a2e 100%); border-bottom: 2px solid #333;">
                  <!-- Floating Rocket -->
                  <div class="rocket" style="font-size: 60px; margin-bottom: 10px;">🚀</div>
                  <h1 style="margin: 0; font-family: 'Orbitron', monospace; font-weight: 900; font-size: 28px; color: #ffffff; text-shadow: 0 0 20px #4a90e2;">
                    MISSION CONTROL
                  </h1>
                  <p style="margin: 5px 0 0 0; font-size: 14px; color: #888; font-weight: 300; letter-spacing: 2px;">
                    EMAIL VERIFICATION REQUIRED
                  </p>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px; text-align: center; background: linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(26,26,46,0.95) 100%);">
                  
                  <!-- Astronaut Welcome -->
                  <div style="margin-bottom: 30px;">
                    <div style="font-size: 40px; margin-bottom: 15px;">👨‍🚀</div>
                    <h2 style="margin: 0 0 10px 0; font-family: 'Orbitron', monospace; font-size: 24px; color: #4a90e2; text-shadow: 0 0 10px rgba(74, 144, 226, 0.5);">
                      Application Received, ASTRONAUT! ${name}
                    </h2>
                    <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #4a90e2, #00d4ff); margin: 15px auto;"></div>
                  </div>
                  
                  <!-- Message -->
                  <p style="font-size: 16px; color: #cccccc; line-height: 1.6; margin: 0 0 20px 0; font-weight: 300;">
                    🌟 Thank you for applying to <strong style="color: #00d4ff;">SEDS Antariksh</strong>! Your application has been received and you're <strong style="color: #4a90e2;">one step closer</strong> to joining our space exploration student chapter.
                  </p>
                  
                  <p style="font-size: 15px; color: #999999; line-height: 1.6; margin: 0 0 35px 0;">
                    🛰️ Please verify your email to complete your application submission. Our selection team will review your application and contact you regarding the next steps in our recruitment process.
                  </p>
                  
                  <!-- Verification Button -->
                  <div style="margin: 35px 0;">
                    <a href="${verificationLink}" 
                       class="verify-btn"
                       style="display: inline-block; padding: 18px 40px; 
                              background: linear-gradient(45deg, #4a90e2 0%, #00d4ff 100%); 
                              color: #000000; text-decoration: none; 
                              border-radius: 50px; font-weight: 600; font-size: 16px;
                              font-family: 'Orbitron', monospace;
                              box-shadow: 0 10px 30px rgba(74, 144, 226, 0.3);
                              border: 2px solid transparent;
                              letter-spacing: 1px;
                              transition: all 0.3s ease;">
                      🚀 VERIFY APPLICATION
                    </a>
                  </div>
                  
                  <!-- Mission Timeline -->
                  <div style="margin: 35px 0; padding: 25px; background: rgba(255, 255, 255, 0.05); border-radius: 15px; border: 1px solid #333;">
                    <h3 style="margin: 0 0 15px 0; font-family: 'Orbitron', monospace; color: #4a90e2; font-size: 16px;">
                      🎯 APPLICATION STATUS
                    </h3>
                    <div style="text-align: left; color: #cccccc; font-size: 14px; line-height: 1.8;">
                      <div>✅ Application Submitted</div>
                      <div style="color: #00d4ff;">🔄 Email Verification (Current Step)</div>
                      <div style="color: #666;">📋 Application Review</div>
                      <div style="color: #666;">🎤 Interview/Skills Assessment</div>
                      <div style="color: #666;">⭐ Selection Results</div>
                    </div>
                  </div>
                  
                  <!-- Selection Process Info -->
                  <div style="margin-top: 30px; padding: 20px; background: rgba(74, 144, 226, 0.1); border-left: 4px solid #4a90e2; border-radius: 5px;">
                    <p style="font-size: 14px; color: #4a90e2; margin: 0 0 8px 0; font-weight: 600; text-align: left;">
                      🚀 What's Next?
                    </p>
                    <p style="font-size: 13px; color: #cccccc; margin: 0; text-align: left; line-height: 1.5;">
                      After email verification, our recruitment team will review your application. Selected candidates will be contacted for interviews or skills assessment. We'll notify you of your application status within 7-10 days.
                    </p>
                  </div>
                  
                  <!-- Alternative Link -->
                  <div style="margin-top: 30px; padding: 20px; background: rgba(255, 255, 255, 0.02); border-radius: 10px;">
                    <p style="font-size: 13px; color: #777777; margin: 0 0 8px 0;">
                      🔗 If the button doesn't work, copy and paste this link:
                    </p>
                    <p style="font-size: 12px; color: #4a90e2; margin: 0; word-break: break-all; font-family: monospace;">
                     ${verificationLink}
                    </p>
                  </div>
                  
                  <!-- Security Note -->
                  <div style="margin-top: 30px; padding: 15px; background: rgba(255, 165, 0, 0.1); border-left: 4px solid #ffa500; border-radius: 5px;">
                    <p style="font-size: 13px; color: #ffa500; margin: 0; text-align: left;">
                      🛡️ <strong>Security Note:</strong> If you didn't apply to SEDS Antariksh, you can safely ignore this email. This verification link will expire in 24 hours.
                    </p>
                  </div>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 25px 30px; text-align: center; background: #000000; border-top: 1px solid #333;">
                  <div style="margin-bottom: 15px;">
                    <span style="font-size: 24px;">🌍</span>
                    <span style="font-size: 20px; margin: 0 10px;">•</span>
                    <span style="font-size: 24px;">🚀</span>
                    <span style="font-size: 20px; margin: 0 10px;">•</span>
                    <span style="font-size: 24px;">⭐</span>
                  </div>
                  
                  <p style="margin: 0 0 10px 0; font-family: 'Orbitron', monospace; font-size: 14px; color: #4a90e2; font-weight: 600;">
                    SEDS ANTARIKSH STUDENT CHAPTER
                  </p>
                  
                  <p style="margin: 0; font-size: 11px; color: #666666; font-weight: 300;">
                    © 2025 SEDS Antariksh • Student Chapter Application Portal • All Rights Reserved
                  </p>
                  
                  <div style="margin-top: 15px; font-size: 10px; color: #444444;">
                    🌌 Ad Astra Per Aspera - Through Hardships to the Stars 🌌
                  </div>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
  `;
}
