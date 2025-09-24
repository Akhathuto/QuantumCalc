import React from 'react';
import { Building, Globe, Mail, Phone, MapPin, BarChart2, Users, UserCheck } from 'lucide-react';

const InfoCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div className="bg-brand-surface/50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4 text-brand-accent flex items-center gap-2">
            <Icon size={22} />
            {title}
        </h3>
        <div className="space-y-2">{children}</div>
    </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row justify-between py-2 border-b border-brand-border last:border-b-0">
        <span className="font-semibold text-brand-text-secondary">{label}</span>
        <span className="font-mono text-right">{value}</span>
    </div>
);

const About: React.FC = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-brand-primary">About the Supplier</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <InfoCard title="Supplier Identification" icon={Building}>
                        <InfoRow label="Legal Name" value="EDGTEC" />
                        <InfoRow label="Supplier Number" value="MAAA1626554" />
                        <InfoRow label="Supplier Type" value="Private Company (Pty)(Ltd)" />
                        <InfoRow label="Registration Number" value="2025/534716/07" />
                        <InfoRow label="Business Status" value="In Business" />
                        <InfoRow label="Tax Status" value="Tax Compliant" />
                    </InfoCard>

                    <InfoCard title="Contact Information" icon={Users}>
                         <div>
                            <p className="font-bold">Ranthutu Lepheane (Preferred)</p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-brand-text-secondary">
                                <Mail size={14} /><a href="mailto:r.lepheane@outlook.com" className="hover:text-brand-primary">r.lepheane@outlook.com</a>
                            </div>
                             <div className="flex items-center gap-2 mt-1 text-sm text-brand-text-secondary">
                                <Phone size={14} /><span>+277 11 84 6709</span>
                            </div>
                        </div>
                        <div className="pt-2 mt-2 border-t border-brand-border">
                            <p className="font-bold">Siphosakhe Mathews Msimango</p>
                             <div className="flex items-center gap-2 mt-1 text-sm text-brand-text-secondary">
                                <Mail size={14} /><a href="mailto:siphosakhemsimanngo@gmail.com" className="hover:text-brand-primary">siphosakhemsimanngo@gmail.com</a>
                            </div>
                             <div className="flex items-center gap-2 mt-1 text-sm text-brand-text-secondary">
                                <Phone size={14} /><span>069 423 7030</span>
                            </div>
                        </div>
                    </InfoCard>

                     <InfoCard title="Registered Address" icon={MapPin}>
                        <p>106312 NGWABE STREET KWA-THEMA MINI SELECOURT</p>
                        <p>SPRINGS, Springs Central</p>
                        <p>Gauteng, 1575</p>
                        <p>South Africa</p>
                    </InfoCard>
                </div>

                 <div className="space-y-8">
                    <InfoCard title="Ownership Structure" icon={UserCheck}>
                        <InfoRow label="Black Owned" value="100.00%" />
                        <InfoRow label="Youth Owned" value="100.00%" />
                        <div className="pt-4 mt-2 border-t border-brand-border">
                            <h4 className="font-semibold text-brand-text mb-2">Owners:</h4>
                            <ul className="list-disc list-inside text-brand-text-secondary">
                                <li>Ranthutu Lepheane</li>
                                <li>Siphosakhe Mathews Msimango</li>
                            </ul>
                        </div>
                    </InfoCard>
                 </div>
            </div>
        </div>
    );
};

export default About;