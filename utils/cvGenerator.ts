import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export interface SellerCVData {
  name: string;
  location: string;
  phoneNumber: string;
  email?: string;
  bio?: string;
  skills: string[];
  rating: number;
  totalRatings: number;
  services: Array<{
    title: string;
    price: string;
    category: string;
    description?: string;
  }>;
  completedJobs: Array<{
    title: string;
    completedAt: string;
    rating?: number;
    review?: string;
  }>;
  followers: number;
  totalJobs: number;
}

export const generateSellerCV = async (sellerData: SellerCVData): Promise<void> => {
  try {
    const htmlContent = generateCVHTML(sellerData);
    
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Download Digital CV',
        UTI: 'com.adobe.pdf',
      });
    }
  } catch (error) {
    console.error('Error generating CV:', error);
    throw new Error('Failed to generate Digital CV');
  }
};

const generateCVHTML = (data: SellerCVData): string => {
  const skillsList = data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
  
  const servicesList = data.services.map(service => `
    <div class="service-item">
      <div class="service-header">
        <h4>${service.title}</h4>
        <span class="service-price">${service.price}</span>
      </div>
      <p class="service-category">${service.category}</p>
      ${service.description ? `<p class="service-description">${service.description}</p>` : ''}
    </div>
  `).join('');

  const completedJobsList = data.completedJobs.map(job => `
    <div class="job-item">
      <h4>${job.title}</h4>
      <p class="job-date">Completed: ${job.completedAt}</p>
      ${job.rating ? `<p class="job-rating">Rating: ${job.rating}/5 ⭐</p>` : ''}
      ${job.review ? `<p class="job-review">"${job.review}"</p>` : ''}
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Udyami Digital CV - ${data.name}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
          padding: 40px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #b73c2f;
          padding-bottom: 20px;
        }
        
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #b73c2f;
          margin-bottom: 10px;
        }
        
        .subtitle {
          color: #956a41;
          font-size: 16px;
        }
        
        .profile-section {
          margin-bottom: 30px;
        }
        
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        
        .profile-info h1 {
          font-size: 32px;
          color: #b73c2f;
          margin-bottom: 8px;
        }
        
        .profile-details {
          color: #666;
          font-size: 16px;
        }
        
        .stats {
          display: flex;
          gap: 20px;
          margin-top: 15px;
        }
        
        .stat-item {
          text-align: center;
          background: #fff2e1;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e19b3c;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #b73c2f;
        }
        
        .stat-label {
          font-size: 12px;
          color: #956a41;
          margin-top: 5px;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 20px;
          color: #b73c2f;
          margin-bottom: 15px;
          border-bottom: 2px solid #e19b3c;
          padding-bottom: 8px;
        }
        
        .bio {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #b73c2f;
          margin-bottom: 20px;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .skill-tag {
          background: #b73c2f;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
        
        .services-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .service-item {
          background: #fff;
          border: 1px solid #e19b3c;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 10px;
        }
        
        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .service-header h4 {
          color: #b73c2f;
          font-size: 16px;
        }
        
        .service-price {
          background: #4caf50;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: bold;
        }
        
        .service-category {
          color: #956a41;
          font-size: 14px;
          font-style: italic;
        }
        
        .service-description {
          margin-top: 8px;
          color: #666;
          font-size: 14px;
        }
        
        .jobs-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .job-item {
          background: #fff;
          border: 1px solid #e19b3c;
          border-radius: 8px;
          padding: 15px;
        }
        
        .job-item h4 {
          color: #b73c2f;
          margin-bottom: 8px;
        }
        
        .job-date {
          color: #956a41;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .job-rating {
          color: #4caf50;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .job-review {
          font-style: italic;
          color: #666;
          background: #f9f9f9;
          padding: 10px;
          border-radius: 4px;
          border-left: 3px solid #b73c2f;
        }
        
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e19b3c;
          color: #956a41;
          font-size: 14px;
        }
        
        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Udyami</div>
        <div class="subtitle">Digital CV</div>
      </div>
      
      <div class="profile-section">
        <div class="profile-header">
          <div class="profile-info">
            <h1>${data.name}</h1>
            <div class="profile-details">
              <p>📍 ${data.location}</p>
              <p>📞 ${data.phoneNumber}</p>
              ${data.email ? `<p>📧 ${data.email}</p>` : ''}
            </div>
          </div>
        </div>
        
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${data.rating}</div>
            <div class="stat-label">Rating</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${data.totalJobs}</div>
            <div class="stat-label">Jobs Completed</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${data.followers}</div>
            <div class="stat-label">Followers</div>
          </div>
        </div>
      </div>
      
      ${data.bio ? `
        <div class="section">
          <h2 class="section-title">About Me</h2>
          <div class="bio">${data.bio}</div>
        </div>
      ` : ''}
      
      <div class="section">
        <h2 class="section-title">Skills & Expertise</h2>
        <div class="skills-container">
          ${skillsList}
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">Services Offered</h2>
        <div class="services-container">
          ${servicesList}
        </div>
      </div>
      
      ${data.completedJobs.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Recent Work</h2>
          <div class="jobs-container">
            ${completedJobsList}
          </div>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Generated by Udyami - Empowering India's Workers</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;
}; 