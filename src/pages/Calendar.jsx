import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  max-width: 900px; 
  margin: 0 auto 40px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
`;

const TopLayout = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
  margin-bottom: 20px; /* Ajustado para aproximar os próximos eventos */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CalendarBox = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  padding: 20px;
  flex: 0 0 350px; 
  width: 100%;
  box-sizing: border-box;
`;

const DayEventsBox = styled.div`
  flex: 1; 
  width: 100%;
`;

// Elementos do Calendário Visual 
const CalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.1em;
`;

const CalNavBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  color: #3498db;
  padding: 5px 10px;
  border-radius: 4px;
  &:hover { background-color: #f1f2f6; }
`;

const CalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px; 
  text-align: center;
`;

const CalDayHeader = styled.div`
  font-size: 0.85em;
  font-weight: bold;
  color: #7f8c8d;
  margin-bottom: 10px;
`;

const CalDay = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  margin: 0 auto;
  border-radius: 50%;
  font-size: 0.9em;
  cursor: ${props => props.$isEmpty ? 'default' : 'pointer'};
  
  background-color: ${props => props.$isSelected ? '#3498db' : 'transparent'};
  color: ${props => props.$isSelected ? 'white' : (props.$isToday ? '#3498db' : (props.$isEmpty ? 'transparent' : '#2c3e50'))};
  font-weight: ${props => props.$isToday || props.$isSelected ? 'bold' : 'normal'};
  
  border: ${props => props.$isToday && !props.$isSelected ? '1px solid #3498db' : '1px solid transparent'};

  &:hover {
    background-color: ${props => !props.$isEmpty && !props.$isSelected ? '#f1f2f6' : ''};
  }
`;

const EventDot = styled.div`
  width: 5px;
  height: 5px;
  background-color: ${props => props.$isSelected ? 'white' : '#e74c3c'};
  border-radius: 50%;
  position: absolute;
  bottom: 4px; 
`;

// Lista de Eventos
const SectionTitle = styled.h2`
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 10px;
  margin-top: 0;
  margin-bottom: 0px;
  font-size: 1.3em;
`;

const EventCard = styled.div`
  background-color: ${props => props.$isHoliday ? '#fdf2f2' : 'white'};
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  border-left: 4px solid ${props => props.$isHoliday ? '#e74c3c' : '#3498db'};
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  strong {
    color: #2c3e50;
    font-size: 1.1em;
  }

  span {
    font-size: 0.8em;
    color: #e74c3c;
    font-weight: bold;
  }
`;

const DeleteBtn = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:hover { background-color: #c0392b; }
`;

const GroupedEventsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const DayGroup = styled.div`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const DayGroupTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.05em;
  color: #2c3e50;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 8px;
`;

const CompactEventItem = styled.div`
  background-color: ${props => props.$isHoliday ? '#fdf2f2' : '#f8f9fa'};
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 3px solid ${props => props.$isHoliday ? '#e74c3c' : '#3498db'};
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;

  &:last-child {
    margin-bottom: 0;
  }

  span.holiday-tag {
    font-size: 0.75em;
    color: #e74c3c;
    font-weight: bold;
    margin-left: 6px;
  }
`;

const CompactDeleteBtn = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 0.85em;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  
  &:hover { text-decoration: underline; }
`;

const FormContainer = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.95em;
`;

const AddBtn = styled.button`
  padding: 10px 20px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover { background-color: #2ecc71; }
`;

const formatarDataComDiaSemana = (date) => {
  const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
  const str = date.toLocaleDateString('pt-BR', options);
  return str.charAt(0).toUpperCase() + str.slice(1);
};


function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [title, setTitle] = useState(''); 
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); 

  const userRole = localStorage.getItem('userRole');
  const isTeacher = userRole === 'teacher' || userRole === 'professor';

  useEffect(() => {
    loadEvents();
  }, []);

  // Sempre que o ano mudar no calendário, busca os feriados nacionais daquele ano
  useEffect(() => {
    const yearToFetch = currentDate.getFullYear();
    fetchHolidays(yearToFetch);
  }, [currentDate]);

  const loadEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    }
  };

  const fetchHolidays = async (year) => {
    try {
      const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
      if (response.ok) {
        const data = await response.json();
        setHolidays(data); // data é um array com { date: 'YYYY-MM-DD', name: '...' }
      }
    } catch (error) {
      console.error("Erro ao carregar feriados nacionais:", error);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title || !selectedDate) return;

    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      
      const safeDate = `${year}-${month}-${day}T12:00:00`; 
      
      await api.post('/events', { title, date: safeDate });
      setTitle('');
      loadEvents();
    } catch (error) {
      console.error("Erro ao criar evento:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Deseja deletar este evento?")) return;
    try {
      await api.delete(`/events/${id}`);
      loadEvents();
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
    }
  };

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
  const allDays = [...blanks, ...days];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDate(new Date(year, month, day));
  };

  // ombinar Eventos da API do Banco e Feriados Nacionais
  const formattedHolidays = holidays.map(h => ({
    _id: `holiday-${h.date}`,
    title: h.name,
    date: `${h.date}T12:00:00`,
    isHoliday: true
  }));

  const allCalendarItems = [...events, ...formattedHolidays];

  const selectedDayItems = allCalendarItems.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getDate() === selectedDate.getDate() &&
           itemDate.getMonth() === selectedDate.getMonth() &&
           itemDate.getFullYear() === selectedDate.getFullYear();
  });

  // --- 2. Lógica dos Próximos Eventos e Feriados (Agrupados e Limitados a 3 Dias) ---
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const upcomingRaw = allCalendarItems
    .filter(item => new Date(item.date) >= startOfToday)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const groupedEvents = [];
  upcomingRaw.forEach(item => {
    const dateObj = new Date(item.date);
    const dateKey = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;
    
    let group = groupedEvents.find(g => g.key === dateKey);
    if (!group) {
      group = { 
        key: dateKey, 
        dateObj: dateObj, 
        events: [] 
      };
      groupedEvents.push(group);
    }
    group.events.push(item);
  });

  const top3UpcomingDays = groupedEvents.slice(0, 3);

  return (
    <Container>

      <TopLayout>
        {/* Coluna 1: Calendário */}
        <CalendarBox>
          <CalHeader>
            <CalNavBtn onClick={prevMonth}>&lt;</CalNavBtn>
            <span>{monthNames[month]} {year}</span>
            <CalNavBtn onClick={nextMonth}>&gt;</CalNavBtn>
          </CalHeader>
          <CalGrid>
            {weekDays.map((d, i) => <CalDayHeader key={i}>{d}</CalDayHeader>)}
            {allDays.map((day, i) => {
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();

              const hasItemOnThisDay = allCalendarItems.some(item => {
                const itemDate = new Date(item.date);
                return itemDate.getDate() === day && itemDate.getMonth() === month && itemDate.getFullYear() === year;
              });

              return (
                <CalDay 
                  key={i} 
                  $isEmpty={!day} 
                  $isToday={isToday} 
                  $isSelected={isSelected}
                  onClick={() => handleDayClick(day)}
                >
                  {day || ''}
                  {day && hasItemOnThisDay && <EventDot $isSelected={isSelected} />}
                </CalDay>
              );
            })}
          </CalGrid>
        </CalendarBox>

        {/* Coluna 2: Eventos e Feriados do Dia Selecionado */}
        <DayEventsBox>
          <SectionTitle>
            Eventos de {formatarDataComDiaSemana(selectedDate)}
          </SectionTitle>

          {isTeacher && (
            <FormContainer onSubmit={handleAddEvent}>
              <Input 
                type="text" 
                placeholder="Nome do evento (Ex: Prova de Matemática)" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
              <AddBtn type="submit">Adicionar</AddBtn>
            </FormContainer>
          )}
          
          {selectedDayItems.length === 0 ? (
            <p style={{ color: '#7f8c8d' }}>Nenhum evento agendado para este dia.</p>
          ) : (
            selectedDayItems.map(item => (
              <EventCard key={item._id} $isHoliday={item.isHoliday}>
                <EventInfo>
                  <strong>{item.title}</strong>
                  {item.isHoliday && <span>[Feriado Nacional]</span>}
                </EventInfo>
                {isTeacher && !item.isHoliday && (
                  <DeleteBtn onClick={() => handleDeleteEvent(item._id)}>Excluir</DeleteBtn>
                )}
              </EventCard>
            ))
          )}
        </DayEventsBox>
      </TopLayout>

      {/* SEÇÃO INFERIOR: Próximos Eventos e Feriados */}
      <SectionTitle>Próximos Eventos</SectionTitle>
      
      {top3UpcomingDays.length === 0 ? (
        <p style={{ color: '#7f8c8d' }}>Nenhum evento futuro agendado.</p>
      ) : (
        <GroupedEventsContainer>
          {top3UpcomingDays.map(group => (
            <DayGroup key={group.key}>
              <DayGroupTitle>{formatarDataComDiaSemana(group.dateObj)}</DayGroupTitle>
              
              {group.events.map(item => (
                <CompactEventItem key={item._id} $isHoliday={item.isHoliday}>
                  <div>
                    <strong>{item.title}</strong>
                    {item.isHoliday && <span className="holiday-tag">[Feriado]</span>}
                  </div>
                  {isTeacher && !item.isHoliday && (
                    <CompactDeleteBtn onClick={() => handleDeleteEvent(item._id)}>
                      Excluir
                    </CompactDeleteBtn>
                  )}
                </CompactEventItem>
              ))}
            </DayGroup>
          ))}
        </GroupedEventsContainer>
      )}
      
    </Container>
  );
}

export default CalendarPage;